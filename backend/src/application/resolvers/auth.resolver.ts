import { Arg, Mutation, Resolver } from 'type-graphql'
import { Service, Inject } from 'typedi'
import {
  LoginInput,
  LoginResponse,
  RefreshTokenInput,
  RefreshTokenResponse,
  RegisterInput,
  RegisterResponse,
} from '@/domain/dtos/index.js'
import { AuthService } from '../services/auth.service.js'

@Service()
@Resolver()
export class AuthResolver {
  @Inject(() => AuthService)
  private authService!: AuthService

  @Mutation(() => LoginResponse)
  async login(
    @Arg('data', () => LoginInput) data: LoginInput
  ): Promise<LoginResponse> {
    const { token, refreshToken, user } = await this.authService.login(
      data.email,
      data.password
    )
    return { token, refreshToken, user }
  }

  @Mutation(() => RegisterResponse)
  async register(
    @Arg('data', () => RegisterInput) data: RegisterInput
  ): Promise<RegisterResponse> {
    const { token, refreshToken, user } = await this.authService.register(data)
    return { token, refreshToken, user }
  }

  @Mutation(() => RefreshTokenResponse)
  async refreshToken(
    @Arg('data', () => RefreshTokenInput) data: RefreshTokenInput
  ): Promise<RefreshTokenResponse> {
    const { token, refreshToken, user } = await this.authService.refreshToken(
      data.refreshToken
    )
    return { token, refreshToken, user }
  }
}
