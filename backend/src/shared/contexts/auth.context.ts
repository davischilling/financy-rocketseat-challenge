import type { ExpressContextFunctionArgument } from '@as-integrations/express5'
import { verifyJwt } from '../utils/jwt.js'

export type GraphqlContext = {
  user: string | undefined
  token: string | undefined
  req: ExpressContextFunctionArgument['req']
  res: ExpressContextFunctionArgument['res']
}

export const createContext = async ({
  req,
  res,
}: ExpressContextFunctionArgument): Promise<GraphqlContext> => {
  const authHeader = req.headers.authorization
  let user: string | undefined
  let token: string | undefined

  if (authHeader?.startsWith('Bearer ')) {
    token = authHeader.substring('Bearer '.length)
    try {
      const payload = verifyJwt(token)
      if (payload) {
        user = payload.userId
      }
    } catch (err) {
      console.error('JWT verification failed:', err)
    }
  }

  return {
    user,
    token,
    req,
    res,
  }
}
