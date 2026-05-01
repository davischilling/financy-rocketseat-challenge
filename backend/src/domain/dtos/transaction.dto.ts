import { Field, Float, InputType } from 'type-graphql'

@InputType()
export class CreateTransactionInput {
  constructor(
    title: string,
    value: number,
    type: string,
    categoryId?: string | null
  ) {
    this.title = title
    this.value = value
    this.type = type
    this.categoryId = categoryId ?? null
  }

  @Field(() => String)
  title: string

  @Field(() => Float)
  value: number

  @Field(() => String)
  type: string

  @Field(() => String, { nullable: true })
  categoryId?: string | null
}

@InputType()
export class UpdateTransactionInput {
  constructor(
    title?: string | null,
    value?: number | null,
    type?: string | null,
    categoryId?: string | null
  ) {
    this.title = title ?? null
    this.value = value ?? null
    this.type = type ?? null
    this.categoryId = categoryId ?? null
  }

  @Field(() => String, { nullable: true })
  title?: string | null

  @Field(() => Float, { nullable: true })
  value?: number | null

  @Field(() => String, { nullable: true })
  type?: string | null

  @Field(() => String, { nullable: true })
  categoryId?: string | null
}
