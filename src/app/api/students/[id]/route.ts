import { NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { studentUpdateSchema } from '@/lib/schemas/student'
import { getWardenId } from '@/lib/auth'

export async function PATCH(
  request: Request,
  { params }: { params: Promise<{ id: string }> },
) {
  const wardenId = await getWardenId()
  if (!wardenId) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

  const { id } = await params
  const studentId = Number(id)
  if (!Number.isFinite(studentId)) {
    return NextResponse.json({ error: 'Invalid id' }, { status: 400 })
  }
  const body = await request.json().catch(() => ({}))
  const parsed = studentUpdateSchema.safeParse(body)
  if (!parsed.success) {
    return NextResponse.json(
      { error: parsed.error.issues[0]?.message || 'Invalid input' },
      { status: 400 },
    )
  }
  try {
    const student = await prisma.student.update({
      where: { id: studentId, wardenId },
      data: parsed.data,
    })
    return NextResponse.json(student)
  } catch {
    return NextResponse.json({ error: 'Failed to update student' }, { status: 409 })
  }
}

export async function DELETE(
  _request: Request,
  { params }: { params: Promise<{ id: string }> },
) {
  const wardenId = await getWardenId()
  if (!wardenId) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

  const { id } = await params
  const studentId = Number(id)
  if (!Number.isFinite(studentId)) {
    return NextResponse.json({ error: 'Invalid id' }, { status: 400 })
  }
  await prisma.student.delete({ where: { id: studentId, wardenId } })
  return NextResponse.json({ ok: true })
}
