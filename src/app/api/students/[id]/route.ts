import { NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'

export async function DELETE(
  _request: Request,
  { params }: { params: Promise<{ id: string }> },
) {
  const { id } = await params
  const studentId = Number(id)
  if (!Number.isFinite(studentId)) {
    return NextResponse.json({ error: 'Invalid id' }, { status: 400 })
  }
  await prisma.student.delete({ where: { id: studentId } })
  return NextResponse.json({ ok: true })
}
