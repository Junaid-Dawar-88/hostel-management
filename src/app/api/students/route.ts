import { NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { studentCreateSchema } from '@/lib/schemas/student'

export async function GET() {
  const students = await prisma.student.findMany({
    include: { room: true },
    orderBy: { createdAt: 'desc' },
  })
  return NextResponse.json(students)
}

export async function POST(request: Request) {
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
      where: { id: roomId },
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
      data: { ...rest, roomId: roomId ?? null },
    })
    return NextResponse.json(student, { status: 201 })
  } catch {
    return NextResponse.json({ error: 'Roll number must be unique' }, { status: 409 })
  }
}
