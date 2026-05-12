import { create } from 'zustand'
import { persist } from 'zustand/middleware'
import { apolloClient } from '@/domain/lib/graphql/apollo'
import type { User, RegisterInput, LoginInput } from '@/domain/types'
import { REGISTER, LOGIN, REFRESH_TOKEN } from '@/domain/lib/graphql/mutations/auth'

type AuthMutationData<K extends string> = {
  [key in K]: { token: string; refreshToken: string; user: User }
}

interface AuthState {
  user: User | null
  token: string | null
  refreshToken: string | null
  isAuthenticated: boolean
  login: (data: LoginInput) => Promise<boolean>
  signup: (data: RegisterInput) => Promise<boolean>
  logout: () => void
  updateUser: (user: Partial<User>) => void
  refresh: () => Promise<boolean>
}

// Shared promise to prevent concurrent refresh calls from issuing multiple requests.
// The backend rotates refresh tokens on use, so only the first caller succeeds.
let pendingRefresh: Promise<boolean> | null = null

export const useAuthStore = create<AuthState>()(
  persist(
    (set, get) => ({
      user: null,
      token: null,
      refreshToken: null,
      isAuthenticated: false,

      login: async (loginData) => {
        const { data } = await apolloClient.mutate<
          AuthMutationData<'login'>,
          { data: LoginInput }
        >({
          mutation: LOGIN,
          variables: { data: loginData },
        })
        if (data?.login) {
          const { user, token, refreshToken } = data.login
          set({ user, token, refreshToken, isAuthenticated: true })
          return true
        }
        return false
      },

      signup: async (registerData) => {
        const { data } = await apolloClient.mutate<
          AuthMutationData<'register'>,
          { data: RegisterInput }
        >({
          mutation: REGISTER,
          variables: { data: registerData },
        })
        if (data?.register) {
          const { user, token, refreshToken } = data.register
          set({ user, token, refreshToken, isAuthenticated: true })
          return true
        }
        return false
      },

      logout: () => {
        set({ user: null, token: null, refreshToken: null, isAuthenticated: false })
        apolloClient.clearStore()
      },

      updateUser: (updatedUser) => {
        set((state) => ({
          user: state.user ? { ...state.user, ...updatedUser } : null,
        }))
      },

      refresh: async () => {
        if (pendingRefresh) return pendingRefresh

        const { refreshToken } = get()
        if (!refreshToken) return false

        pendingRefresh = apolloClient
          .mutate<
            AuthMutationData<'refreshToken'>,
            { data: { refreshToken: string } }
          >({
            mutation: REFRESH_TOKEN,
            variables: { data: { refreshToken } },
          })
          .then(({ data }) => {
            if (data?.refreshToken) {
              const { token, refreshToken: newRefreshToken, user } = data.refreshToken
              set({ token, refreshToken: newRefreshToken, user, isAuthenticated: true })
              return true
            }
            return false
          })
          .catch(() => false)
          .finally(() => {
            pendingRefresh = null
          })

        return pendingRefresh
      },
    }),
    { name: 'financy-auth' }
  )
)
