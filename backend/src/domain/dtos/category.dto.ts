import { Field, InputType } from 'type-graphql'

@InputType()
export class CreateCategoryInput {
  constructor(
    name: string,
    description?: string | null,
    icon?: string | null,
    color?: string | null
  ) {
    this.name = name
    this.description = description ?? null
    this.icon = icon ?? null
    this.color = color ?? null
  }

  @Field(() => String)
  name: string

  @Field(() => String, { nullable: true })
  description?: string | null

  @Field(() => String, { nullable: true })
  icon?: string | null

  @Field(() => String, { nullable: true })
  color?: string | null
}

@InputType()
export class UpdateCategoryInput {
  constructor(
    name: string,
    description?: string | null,
    icon?: string | null,
    color?: string | null
  ) {
    this.name = name
    this.description = description ?? null
    this.icon = icon ?? null
    this.color = color ?? null
  }

  @Field(() => String)
  name: string

  @Field(() => String, { nullable: true })
  description?: string | null

  @Field(() => String, { nullable: true })
  icon?: string | null

  @Field(() => String, { nullable: true })
  color?: string | null
}
