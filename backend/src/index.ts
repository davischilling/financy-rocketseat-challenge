import 'reflect-metadata'
import 'dotenv/config'
import { ApolloServer } from '@apollo/server'
import { buildSchema } from 'type-graphql'
import { expressMiddleware } from '@as-integrations/express5'
import express from 'express'
import cors from 'cors'
import { Container } from 'typedi'
import {
  AuthResolver,
  CategoryResolver,
  TransactionResolver,
} from './application/resolvers/index.js'
import { createContext } from './shared/contexts/index.js'

async function bootstrap() {
  const app = express()

  const schema = await buildSchema({
    resolvers: [AuthResolver, CategoryResolver, TransactionResolver],
    container: Container,
    validate: false,
    emitSchemaFile: './schema.gql',
  })

  const server = new ApolloServer({
    schema,
  })

  await server.start()

  app.use(
    '/graphql',
    cors<cors.CorsRequest>(),
    express.json(),
    expressMiddleware(server, {
      context: createContext,
    })
  )

  const PORT = process.env.PORT ?? 4000
  app.listen({ port: PORT }, () => {
    console.log(`Server ready at http://localhost:${PORT}/graphql`)
  })
}

bootstrap()
