import jwt, { type Secret, type SignOptions } from 'jsonwebtoken'

export type JwtPayload = {
  userId: string
  email: string
}

export const signJwt = (payload: JwtPayload, expiresIn?: string): string => {
  const secret: Secret = process.env.JWT_SECRET as unknown as Secret
  const options: SignOptions = {}
  if (expiresIn) {
    options.expiresIn = expiresIn as unknown as NonNullable<
      SignOptions['expiresIn']
    >
  }
  return jwt.sign(payload, secret, options)
}

export const verifyJwt = (token: string): JwtPayload | null => {
  const secret: Secret = process.env.JWT_SECRET as unknown as Secret
  try {
    return jwt.verify(token, secret) as JwtPayload
  } catch (_err) {
    return null
  }
}
