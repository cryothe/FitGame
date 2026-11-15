import bcrypt from 'bcryptjs'
import type { Request, Response, NextFunction } from 'express'
import jwt from 'jsonwebtoken'
import { createUser, findUserByEmail, findUserById, publicUser } from './db'

const JWT_SECRET = process.env.JWT_SECRET ?? 'fitgame-dev-secret-change-me'
const TOKEN_TTL = '30d'

type TokenPayload = { sub: number; email: string }

export type AuthedRequest = Request & {
  user?: { id: number; email: string; displayName: string; createdAt: string }
}

function signToken(userId: number, email: string): string {
  const payload: TokenPayload = { sub: userId, email }
  return jwt.sign(payload, JWT_SECRET, { expiresIn: TOKEN_TTL })
}

function isValidEmail(email: string): boolean {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)
}

export function register(req: Request, res: Response) {
  const email = String(req.body?.email ?? '').trim()
  const password = String(req.body?.password ?? '')
  const displayName = String(req.body?.displayName ?? '').trim() || email.split('@')[0]

  if (!isValidEmail(email)) {
    res.status(400).json({ error: 'Enter a valid email.' })
    return
  }
  if (password.length < 6) {
    res.status(400).json({ error: 'Password must be at least 6 characters.' })
    return
  }
  if (findUserByEmail(email)) {
    res.status(409).json({ error: 'An account with that email already exists.' })
    return
  }

  const passwordHash = bcrypt.hashSync(password, 10)
  const user = createUser(email, passwordHash, displayName)
  const token = signToken(user.id, user.email)

  res.status(201).json({ token, user: publicUser(user) })
}

export function login(req: Request, res: Response) {
  const email = String(req.body?.email ?? '').trim()
  const password = String(req.body?.password ?? '')

  const user = findUserByEmail(email)
  if (!user || !bcrypt.compareSync(password, user.password_hash)) {
    res.status(401).json({ error: 'Invalid email or password.' })
    return
  }

  const token = signToken(user.id, user.email)
  res.json({ token, user: publicUser(user) })
}

export function requireAuth(req: AuthedRequest, res: Response, next: NextFunction) {
  const header = req.headers.authorization
  if (!header?.startsWith('Bearer ')) {
    res.status(401).json({ error: 'Missing auth token.' })
    return
  }

  try {
    const decoded = jwt.verify(header.slice(7), JWT_SECRET) as unknown as TokenPayload
    const user = findUserById(decoded.sub)
    if (!user) {
      res.status(401).json({ error: 'User not found.' })
      return
    }
    req.user = publicUser(user)
    next()
  } catch {
    res.status(401).json({ error: 'Invalid or expired token.' })
  }
}

export function me(req: AuthedRequest, res: Response) {
  res.json({ user: req.user })
}
