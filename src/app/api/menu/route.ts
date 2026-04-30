import { NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { menuItemCreateSchema } from '@/lib/schemas/menu'

export async function GET() {
  const items = await prisma.menuItem.findMany({
    orderBy: [{ day: 'asc' }, { meal: 'asc' }],
  })
  return NextResponse.json(items)
}

export async function POST(request: Request) {
  const body = await request.json().catch(() => ({}))
  const parsed = menuItemCreateSchema.safeParse(body)
  if (!parsed.success) {
    return NextResponse.json(
      { error: parsed.error.issues[0]?.message || 'Invalid input' },
      { status: 400 },
    )
  }
  try {
    const item = await prisma.menuItem.create({ data: parsed.data })
    return NextResponse.json(item, { status: 201 })
  } catch {
    return NextResponse.json(
      { error: 'Menu for this day + meal already exists' },
      { status: 409 },
    )
  }
}
