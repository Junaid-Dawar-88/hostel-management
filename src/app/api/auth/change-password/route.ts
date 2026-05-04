import { NextResponse } from 'next/server'
import { cookies } from 'next/headers'
import bcrypt from 'bcryptjs'
import { z } from 'zod'
import { prisma } from '@/lib/prisma'
import { verifyJWT } from '@/lib/jwt'

const schema = z.object({
  currentPassword: z.string().min(1, 'Current password is required'),
  newPassword: z.string().min(6, 'New password must be at least 6 characters'),
})

export async function POST(request: Request) {
  const cookieStore = await cookies()
  const token = cookieStore.get('auth-token')?.value
  const warden = token ? await verifyJWT(token) : null
  if (!warden) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

  const body = await request.json().catch(() => ({}))
  const parsed = schema.safeParse(body)
  if (!parsed.success) {
    return NextResponse.json({ error: parsed.error.issues[0]?.message || 'Invalid input' }, { status: 400 })
  }

  const { currentPassword, newPassword } = parsed.data

  const wardenRecord = await prisma.warden.findUnique({ where: { id: warden.wardenId } })
  if (!wardenRecord) return NextResponse.json({ error: 'Account not found' }, { status: 404 })

  const valid = await bcrypt.compare(currentPassword, wardenRecord.password)
  if (!valid) return NextResponse.json({ error: 'Current password is incorrect' }, { status: 400 })

  const hashed = await bcrypt.hash(newPassword, 10)
  await prisma.warden.update({ where: { id: warden.wardenId }, data: { password: hashed } })

  return NextResponse.json({ ok: true })
}
