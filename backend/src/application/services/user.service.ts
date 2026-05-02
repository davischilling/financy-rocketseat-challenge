import { Service } from 'typedi'
import { prismaClient } from '@/infra/prisma/prisma.js'

@Service()
export class UserService {
  async findUser(id: string) {
    const user = await prismaClient.user.findUnique({ where: { id } })
    if (!user) {
      throw new Error('User not found')
    }
    return user
  }
}
