import { NextResponse } from 'next/server'
import { cookies } from 'next/headers'
import bcrypt from 'bcryptjs'
import { prisma } from '@/lib/prisma'
import { verifyJWT } from '@/lib/jwt'

export async function DELETE(request: Request) {
  const cookieStore = await cookies()
  const token = cookieStore.get('auth-token')?.value
  const warden = token ? await verifyJWT(token) : null
  if (!warden) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

  const body = await request.json().catch(() => ({}))
  const { password } = body
  if (!password) return NextResponse.json({ error: 'Password is required to delete account' }, { status: 400 })

  const wardenRecord = await prisma.warden.findUnique({ where: { id: warden.wardenId } })
  if (!wardenRecord) return NextResponse.json({ error: 'Account not found' }, { status: 404 })

  const valid = await bcrypt.compare(password, wardenRecord.password)
  if (!valid) return NextResponse.json({ error: 'Incorrect password' }, { status: 400 })

  await prisma.warden.delete({ where: { id: warden.wardenId } })

  cookieStore.set('auth-token', '', { maxAge: 0, path: '/' })

  return NextResponse.json({ ok: true })
}
