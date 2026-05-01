import { createParameterDecorator, type ResolverData } from 'type-graphql'
import type { GraphqlContext } from '../contexts/auth.context.js'
import type { User } from '@prisma/client'
import { prismaClient } from '@/infra/prisma/prisma.js'

export const GqlUser = () => {
  return createParameterDecorator(
    async ({ context }: ResolverData<GraphqlContext>): Promise<User | null> => {
      if (!context?.user) {
        return null
      }

      try {
        const user = await prismaClient.user.findUnique({
          where: { id: context.user },
        })
        if (!user) {
          throw new Error('User not found')
        }
        return user
      } catch (error) {
        console.error('Error fetching user:', error)
        return null
      }
    }
  )
}
