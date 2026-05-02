import { create } from 'zustand'
import { persist } from 'zustand/middleware'
import { apolloClient } from '@/domain/lib/graphql/apollo'
import type { User, RegisterInput, LoginInput } from '@/domain/types'
import { REGISTER, LOGIN } from '@/domain/lib/graphql/mutations/auth'

type AuthMutationData<K extends string> = {
  [key in K]: { token: string; refreshToken: string; user: User }
}

interface AuthState {
  user: User | null
  token: string | null
  isAuthenticated: boolean
  login: (data: LoginInput) => Promise<boolean>
  signup: (data: RegisterInput) => Promise<boolean>
  logout: () => void
  updateUser: (user: Partial<User>) => void
}

export const useAuthStore = create<AuthState>()(
  persist(
    (set) => ({
      user: null,
      token: null,
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
          const { user, token } = data.login
          set({ user, token, isAuthenticated: true })
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
          const { user, token } = data.register
          set({ user, token, isAuthenticated: true })
          return true
        }
        return false
      },

      logout: () => {
        set({ user: null, token: null, isAuthenticated: false })
        apolloClient.clearStore()
      },

      updateUser: (updatedUser) => {
        set((state) => ({
          user: state.user ? { ...state.user, ...updatedUser } : null,
        }))
      },
    }),
    { name: 'financy-auth' }
  )
)
