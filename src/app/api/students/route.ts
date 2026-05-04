import { NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { studentCreateSchema } from '@/lib/schemas/student'
import { getWardenId } from '@/lib/auth'

export async function GET() {
  const wardenId = await getWardenId()
  if (!wardenId) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

  const students = await prisma.student.findMany({
    where: { wardenId },
    include: { room: true },
    orderBy: { createdAt: 'desc' },
  })
  return NextResponse.json(students)
}

export async function POST(request: Request) {
  const wardenId = await getWardenId()
  if (!wardenId) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

  const body = await request.json().catch(() => ({}))
  const parsed = studentCreateSchema.safeParse(body)
  if (!parsed.success) {
    return NextResponse.json(
      { error: parsed.error.issues[0]?.message || 'Invalid input' },
      { status: 400 },
    )
  }

  const { roomId, ...rest } = parsed.data

  if (roomId) {
    const room = await prisma.room.findUnique({
      where: { id: roomId, wardenId },
      include: { _count: { select: { students: true } } },
    })
    if (!room) {
      return NextResponse.json({ error: 'Room not found' }, { status: 404 })
    }
    if (room._count.students >= room.capacity) {
      return NextResponse.json({ error: 'Room is full' }, { status: 409 })
    }
  }

  try {
    const student = await prisma.student.create({
      data: { ...rest, roomId: roomId ?? null, wardenId },
    })
    return NextResponse.json(student, { status: 201 })
  } catch {
    return NextResponse.json({ error: 'Roll number must be unique' }, { status: 409 })
  }
}
