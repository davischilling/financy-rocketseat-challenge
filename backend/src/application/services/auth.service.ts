import { Service } from 'typedi'
import { prismaClient } from '@/infra/prisma/prisma.js'
import type { RegisterInput } from '@/domain/dtos/index.js'
import { comparePassword, hashPassword } from '@/shared/utils/hash.js'
import { signJwt, verifyJwt } from '@/shared/utils/jwt.js'
import { User } from '@prisma/client'

const REFRESH_TOKEN_TTL_MS = 7 * 24 * 60 * 60 * 1000

@Service()
export class AuthService {
  async login(email: string, password: string) {
    const user = await prismaClient.user.findUnique({ where: { email } })
    if (!user) {
      throw new Error('Invalid credentials')
    }

    const isPasswordValid = await comparePassword(password, user.password)
    if (!isPasswordValid) {
      throw new Error('Invalid credentials')
    }

    return this.generateTokens(user)
  }

  async register(data: RegisterInput) {
    const existingUser = await prismaClient.user.findUnique({
      where: { email: data.email },
    })
    if (existingUser) {
      throw new Error('User already exists')
    }

    const hashedPassword = await hashPassword(data.password)

    const user = await prismaClient.user.create({
      data: {
        name: data.name,
        email: data.email,
        password: hashedPassword,
      },
    })

    return this.generateTokens(user)
  }

  async refreshToken(token: string) {
    const payload = verifyJwt(token)
    if (!payload) {
      throw new Error('Invalid refresh token')
    }

    const stored = await prismaClient.refreshToken.findUnique({
      where: { token },
    })
    if (!stored) {
      throw new Error('Refresh token not found or already used')
    }

    if (stored.expiresAt < new Date()) {
      await prismaClient.refreshToken.delete({ where: { id: stored.id } })
      throw new Error('Refresh token expired')
    }

    const user = await prismaClient.user.findUnique({
      where: { id: stored.userId },
    })
    if (!user) {
      throw new Error('User not found')
    }

    await prismaClient.refreshToken.delete({ where: { id: stored.id } })

    return this.generateTokens(user)
  }

  private async generateTokens(user: User) {
    const token = signJwt({ userId: user.id, email: user.email }, '1h')
    const refreshToken = signJwt({ userId: user.id, email: user.email }, '7d')

    await prismaClient.refreshToken.create({
      data: {
        token: refreshToken,
        userId: user.id,
        expiresAt: new Date(Date.now() + REFRESH_TOKEN_TTL_MS),
      },
    })

    return { token, refreshToken, user }
  }
}
