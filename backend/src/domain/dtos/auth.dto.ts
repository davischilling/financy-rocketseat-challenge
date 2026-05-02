import { Field, InputType, ObjectType } from 'type-graphql'
import { UserModel } from '@/domain/models/index.js'

@InputType()
export class RegisterInput {
  constructor(name: string, email: string, password: string) {
    this.name = name
    this.email = email
    this.password = password
  }

  @Field(() => String)
  name: string

  @Field(() => String)
  email: string

  @Field(() => String)
  password: string
}

@ObjectType()
export class RegisterResponse {
  constructor(token: string, refreshToken: string, user: UserModel) {
    this.token = token
    this.refreshToken = refreshToken
    this.user = user
  }

  @Field(() => String)
  token: string

  @Field(() => String)
  refreshToken: string

  @Field(() => UserModel)
  user: UserModel
}

@InputType()
export class LoginInput {
  constructor(email: string, password: string) {
    this.email = email
    this.password = password
  }

  @Field(() => String)
  email: string

  @Field(() => String)
  password: string
}

@InputType()
export class RefreshTokenInput {
  constructor(refreshToken: string) {
    this.refreshToken = refreshToken
  }

  @Field(() => String)
  refreshToken: string
}

@ObjectType()
export class RefreshTokenResponse {
  constructor(token: string, refreshToken: string, user: UserModel) {
    this.token = token
    this.refreshToken = refreshToken
    this.user = user
  }

  @Field(() => String)
  token: string

  @Field(() => String)
  refreshToken: string

  @Field(() => UserModel)
  user: UserModel
}

@ObjectType()
export class LoginResponse {
  constructor(token: string, refreshToken: string, user: UserModel) {
    this.token = token
    this.refreshToken = refreshToken
    this.user = user
  }

  @Field(() => String)
  token: string

  @Field(() => String)
  refreshToken: string

  @Field(() => UserModel)
  user: UserModel
}
