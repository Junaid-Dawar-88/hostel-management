import { NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { menuItemUpdateSchema } from '@/lib/schemas/menu'

export async function PATCH(
  request: Request,
  { params }: { params: Promise<{ id: string }> },
) {
  const { id } = await params
  const itemId = Number(id)
  if (!Number.isFinite(itemId)) {
    return NextResponse.json({ error: 'Invalid id' }, { status: 400 })
  }
  const body = await request.json().catch(() => ({}))
  const parsed = menuItemUpdateSchema.safeParse(body)
  if (!parsed.success) {
    return NextResponse.json(
      { error: parsed.error.issues[0]?.message || 'Invalid input' },
      { status: 400 },
    )
  }
  try {
    const item = await prisma.menuItem.update({ where: { id: itemId }, data: parsed.data })
    return NextResponse.json(item)
  } catch {
    return NextResponse.json({ error: 'Failed to update menu' }, { status: 409 })
  }
}

export async function DELETE(
  _request: Request,
  { params }: { params: Promise<{ id: string }> },
) {
  const { id } = await params
  const itemId = Number(id)
  if (!Number.isFinite(itemId)) {
    return NextResponse.json({ error: 'Invalid id' }, { status: 400 })
  }
  await prisma.menuItem.delete({ where: { id: itemId } })
  return NextResponse.json({ ok: true })
}
