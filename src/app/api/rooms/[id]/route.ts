import { NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'

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
