import { Service } from 'typedi'
import type { User } from '@prisma/client'
import { prismaClient } from '../../infra/prisma/prisma.js'
import type { RegisterInput } from '@/domain/dtos/index.js'
import { comparePassword, hashPassword } from '../../shared/utils/hash.js'
import { signJwt } from '../../shared/utils/jwt.js'

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

    return this.generateToken(user)
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

    return this.generateToken(user)
  }

  generateToken(user: User) {
    const token = signJwt({ userId: user.id, email: user.email }, '1h')
    const refreshToken = signJwt({ userId: user.id, email: user.email }, '7d')
    return { token, refreshToken, user }
  }
}
