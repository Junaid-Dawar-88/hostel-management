import { NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { roomUpdateSchema } from '@/lib/schemas/room'

export async function PATCH(
  request: Request,
  { params }: { params: Promise<{ id: string }> },
) {
  const { id } = await params
  const roomId = Number(id)
  if (!Number.isFinite(roomId)) {
    return NextResponse.json({ error: 'Invalid id' }, { status: 400 })
  }
  const body = await request.json().catch(() => ({}))
  const parsed = roomUpdateSchema.safeParse(body)
  if (!parsed.success) {
    return NextResponse.json(
      { error: parsed.error.issues[0]?.message || 'Invalid input' },
      { status: 400 },
    )
  }
  try {
    const room = await prisma.room.update({ where: { id: roomId }, data: parsed.data })
    return NextResponse.json(room)
  } catch {
    return NextResponse.json({ error: 'Failed to update room' }, { status: 409 })
  }
}

export async function DELETE(
  _request: Request,
  { params }: { params: Promise<{ id: string }> },
) {
  const { id } = await params
  const roomId = Number(id)
  if (!Number.isFinite(roomId)) {
    return NextResponse.json({ error: 'Invalid id' }, { status: 400 })
  }
  await prisma.room.delete({ where: { id: roomId } })
  return NextResponse.json({ ok: true })
}
