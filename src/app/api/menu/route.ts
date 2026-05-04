import { NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { menuItemCreateSchema } from '@/lib/schemas/menu'
import { getWardenId } from '@/lib/auth'

export async function GET() {
  const wardenId = await getWardenId()
  if (!wardenId) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

  const items = await prisma.menuItem.findMany({
    where: { wardenId },
    orderBy: [{ day: 'asc' }, { meal: 'asc' }],
  })
  return NextResponse.json(items)
}

export async function POST(request: Request) {
  const wardenId = await getWardenId()
  if (!wardenId) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

  const body = await request.json().catch(() => ({}))
  const parsed = menuItemCreateSchema.safeParse(body)
  if (!parsed.success) {
    return NextResponse.json(
      { error: parsed.error.issues[0]?.message || 'Invalid input' },
      { status: 400 },
    )
  }
  try {
    const item = await prisma.menuItem.create({ data: { ...parsed.data, wardenId } })
    return NextResponse.json(item, { status: 201 })
  } catch {
    return NextResponse.json(
      { error: 'Menu for this day + meal already exists' },
      { status: 409 },
    )
  }
}
