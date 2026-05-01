import type { MiddlewareFn } from 'type-graphql'
import type { GraphqlContext } from '@/shared/contexts/index.js'

export const isAuth: MiddlewareFn<GraphqlContext> = async (
  { context },
  next
) => {
  if (!context.user) {
    throw new Error('Not authenticated')
  }
  return next()
}
