import { NextResponse } from 'next/server'
import { getWarden } from '@/lib/auth'

export async function GET() {
  const warden = await getWarden()
  if (!warden) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }
  return NextResponse.json(warden)
}
