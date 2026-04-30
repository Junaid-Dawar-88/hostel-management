import { NextResponse } from 'next/server'
import { writeFile, mkdir } from 'node:fs/promises'
import path from 'node:path'
import crypto from 'node:crypto'

function getUploadsDir() {
  // In Electron production, UPLOADS_DIR points to AppData/uploads (writable)
  // In development, fall back to public/uploads
  return process.env.UPLOADS_DIR ?? path.join(process.cwd(), 'public', 'uploads')
}

export async function POST(request: Request) {
  const formData = await request.formData()
  const file = formData.get('file')

  if (!(file instanceof File)) {
    return NextResponse.json({ error: 'No file provided' }, { status: 400 })
  }

  if (!file.type.startsWith('image/')) {
    return NextResponse.json({ error: 'File must be an image' }, { status: 400 })
  }

  if (file.size > 5 * 1024 * 1024) {
    return NextResponse.json({ error: 'Max 5MB' }, { status: 400 })
  }

  const bytes = Buffer.from(await file.arrayBuffer())
  const ext = (file.name.split('.').pop() || 'png').toLowerCase()
  const name = `${crypto.randomUUID()}.${ext}`
  const dir = getUploadsDir()

  await mkdir(dir, { recursive: true })
  await writeFile(path.join(dir, name), bytes)

  // Always use /api/uploads/<name> so it works in both dev and production
  return NextResponse.json({ url: `/api/uploads/${name}` })
}
