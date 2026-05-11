import { createHmac, randomBytes, scryptSync, timingSafeEqual } from 'crypto'

export interface AuthTokenPayload {
  sub: string
  email: string
  role: string
  exp: number
}

function encodeBase64Url(input: string) {
  return Buffer.from(input).toString('base64url')
}

function decodeBase64Url(input: string) {
  return Buffer.from(input, 'base64url').toString('utf8')
}

export function hashPassword(password: string) {
  const salt = randomBytes(16).toString('hex')
  const derived = scryptSync(password, salt, 64).toString('hex')
  return `${salt}:${derived}`
}

export function verifyPassword(password: string, hashedPassword: string) {
  const [salt, storedHash] = hashedPassword.split(':')
  if (!salt || !storedHash) return false

  const derived = scryptSync(password, salt, 64)
  const stored = Buffer.from(storedHash, 'hex')

  if (derived.length !== stored.length) return false
  return timingSafeEqual(derived, stored)
}

export function signAuthToken(
  payload: Omit<AuthTokenPayload, 'exp'>,
  secret: string,
  ttlSeconds: number,
) {
  const fullPayload: AuthTokenPayload = {
    ...payload,
    exp: Math.floor(Date.now() / 1000) + ttlSeconds,
  }

  const encodedPayload = encodeBase64Url(JSON.stringify(fullPayload))
  const signature = createHmac('sha256', secret).update(encodedPayload).digest('base64url')
  return `${encodedPayload}.${signature}`
}

export function verifyAuthToken(token: string, secret: string): AuthTokenPayload | null {
  const [encodedPayload, signature] = token.split('.')
  if (!encodedPayload || !signature) return null

  const expectedSignature = createHmac('sha256', secret)
    .update(encodedPayload)
    .digest('base64url')

  if (signature !== expectedSignature) return null

  try {
    const payload = JSON.parse(decodeBase64Url(encodedPayload)) as AuthTokenPayload
    if (payload.exp <= Math.floor(Date.now() / 1000)) return null
    return payload
  } catch {
    return null
  }
}
