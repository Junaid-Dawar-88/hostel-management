import { NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { roomCreateSchema } from '@/lib/schemas/room'

export async function GET() {
  const rooms = await prisma.room.findMany({
    include: {
      students: { orderBy: { createdAt: 'asc' } },
      _count: { select: { students: true } },
    },
    orderBy: { number: 'asc' },
  })
  return NextResponse.json(rooms)
}

export async function POST(request: Request) {
  const body = await request.json().catch(() => ({}))
  const parsed = roomCreateSchema.safeParse(body)
  if (!parsed.success) {
    return NextResponse.json(
      { error: parsed.error.issues[0]?.message || 'Invalid input' },
      { status: 400 },
    )
  }
  try {
    const room = await prisma.room.create({ data: parsed.data })
    return NextResponse.json(room, { status: 201 })
  } catch {
    return NextResponse.json({ error: 'Room number must be unique' }, { status: 409 })
  }
}
