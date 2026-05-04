import { NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { roomCreateSchema } from '@/lib/schemas/room'
import { getWardenId } from '@/lib/auth'

export async function GET() {
  const wardenId = await getWardenId()
  if (!wardenId) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

  const rooms = await prisma.room.findMany({
    where: { wardenId },
    include: {
      students: { orderBy: { createdAt: 'asc' } },
      _count: { select: { students: true } },
    },
    orderBy: { number: 'asc' },
  })
  return NextResponse.json(rooms)
}

export async function POST(request: Request) {
  const wardenId = await getWardenId()
  if (!wardenId) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

  const body = await request.json().catch(() => ({}))
  const parsed = roomCreateSchema.safeParse(body)
  if (!parsed.success) {
    return NextResponse.json(
      { error: parsed.error.issues[0]?.message || 'Invalid input' },
      { status: 400 },
    )
  }
  try {
    const room = await prisma.room.create({ data: { ...parsed.data, wardenId } })
    return NextResponse.json(room, { status: 201 })
  } catch {
    return NextResponse.json({ error: 'Room number must be unique' }, { status: 409 })
  }
}
