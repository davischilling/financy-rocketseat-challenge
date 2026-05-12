import { ApolloClient, HttpLink, ApolloLink, InMemoryCache, Observable } from '@apollo/client'
import { SetContextLink } from '@apollo/client/link/context'
import { onError } from '@apollo/client/link/error'
import { useAuthStore } from '../../stores/auth'

const httpLink = new HttpLink({
  uri: import.meta.env.VITE_BACKEND_URL ?? 'http://localhost:4000/graphql',
})

const authLink = new SetContextLink((prevContext) => {
  const token = useAuthStore.getState().token
  return {
    headers: {
      ...prevContext.headers,
      authorization: token ? `Bearer ${token}` : '',
    },
  }
})

const errorLink = onError(({ graphQLErrors, operation, forward }) => {
  const isAuthError = graphQLErrors?.some((e) => e.message === 'Not authenticated')

  // Guard against infinite loop if the refresh mutation itself fails auth
  if (!isAuthError || operation.operationName === 'RefreshToken') return

  return new Observable((observer) => {
    useAuthStore
      .getState()
      .refresh()
      .then((success) => {
        if (!success) {
          useAuthStore.getState().logout()
          observer.complete()
          return
        }
        const sub = forward(operation).subscribe({
          next: observer.next.bind(observer),
          error: observer.error.bind(observer),
          complete: observer.complete.bind(observer),
        })
        return () => sub.unsubscribe()
      })
      .catch(() => {
        useAuthStore.getState().logout()
        observer.complete()
      })
  })
})

export const apolloClient = new ApolloClient({
  link: ApolloLink.from([errorLink, authLink, httpLink]),
  cache: new InMemoryCache(),
})
