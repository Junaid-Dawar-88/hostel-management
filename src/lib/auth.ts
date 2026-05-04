import { cookies } from 'next/headers'
import { verifyJWT, type JWTPayload } from './jwt'

export type { JWTPayload }
export { signJWT, verifyJWT } from './jwt'

export async function getWarden(): Promise<JWTPayload | null> {
  const cookieStore = await cookies()
  const token = cookieStore.get('auth-token')?.value
  if (!token) return null
  return verifyJWT(token)
}

export async function getWardenId(): Promise<number | null> {
  const warden = await getWarden()
  return warden?.wardenId ?? null
}
