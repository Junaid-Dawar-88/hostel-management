import { NextResponse } from 'next/server'
import { cookies } from 'next/headers'
import { z } from 'zod'
import { prisma } from '@/lib/prisma'
import { verifyJWT, signJWT } from '@/lib/jwt'

const schema = z.object({
  name: z.string().min(2, 'Name must be at least 2 characters'),
  email: z.string().email('Invalid email'),
})

export async function PATCH(request: Request) {
  const cookieStore = await cookies()
  const token = cookieStore.get('auth-token')?.value
  const warden = token ? await verifyJWT(token) : null
  if (!warden) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

  const body = await request.json().catch(() => ({}))
  const parsed = schema.safeParse(body)
  if (!parsed.success) {
    return NextResponse.json({ error: parsed.error.issues[0]?.message || 'Invalid input' }, { status: 400 })
  }

  const { name, email } = parsed.data

  if (email !== warden.email) {
    const existing = await prisma.warden.findUnique({ where: { email } })
    if (existing) return NextResponse.json({ error: 'Email already in use' }, { status: 409 })
  }

  const updated = await prisma.warden.update({
    where: { id: warden.wardenId },
    data: { name, email },
  })

  const newToken = await signJWT({ wardenId: updated.id, email: updated.email, name: updated.name })
  cookieStore.set('auth-token', newToken, {
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    sameSite: 'lax',
    maxAge: 60 * 60 * 24 * 7,
    path: '/',
  })

  return NextResponse.json({ name: updated.name, email: updated.email })
}
