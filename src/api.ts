import { Platform } from 'react-native'

/**
 * API base URL.
 * - Web / simulator on same machine: localhost
 * - Physical phone via Expo Go: set EXPO_PUBLIC_API_URL to your computer's LAN IP
 */
const DEFAULT_HOST = Platform.OS === 'android' ? '10.0.2.2' : '127.0.0.1'

export const API_URL =
  process.env.EXPO_PUBLIC_API_URL?.replace(/\/$/, '') ?? `http://${DEFAULT_HOST}:3001`

export type User = {
  id: number
  email: string
  displayName: string
  createdAt: string
}

type AuthResponse = {
  token: string
  user: User
}

async function parseError(res: Response): Promise<string> {
  try {
    const data = (await res.json()) as { error?: string }
    if (data.error) return data.error
  } catch {
    // ignore
  }
  return `Request failed (${res.status})`
}

export async function registerAccount(input: {
  email: string
  password: string
  displayName: string
}): Promise<AuthResponse> {
  const res = await fetch(`${API_URL}/auth/register`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(input),
  })
  if (!res.ok) throw new Error(await parseError(res))
  return res.json() as Promise<AuthResponse>
}

export async function loginAccount(input: {
  email: string
  password: string
}): Promise<AuthResponse> {
  const res = await fetch(`${API_URL}/auth/login`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(input),
  })
  if (!res.ok) throw new Error(await parseError(res))
  return res.json() as Promise<AuthResponse>
}

export async function fetchMe(token: string): Promise<User> {
  const res = await fetch(`${API_URL}/auth/me`, {
    headers: { Authorization: `Bearer ${token}` },
  })
  if (!res.ok) throw new Error(await parseError(res))
  const data = (await res.json()) as { user: User }
  return data.user
}
