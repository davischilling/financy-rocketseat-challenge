import { Field, Float, GraphQLISODateTime, InputType, registerEnumType } from 'type-graphql'

export const TransactionType = {
  INCOME: 'INCOME',
  EXPENSE: 'EXPENSE',
} as const

export type TransactionType = (typeof TransactionType)[keyof typeof TransactionType]

registerEnumType(TransactionType, { name: 'TransactionType' })

@InputType()
export class CreateTransactionInput {
  constructor(
    title: string,
    value: number,
    type: TransactionType,
    categoryId?: string | null,
    date?: Date | null
  ) {
    this.title = title
    this.value = value
    this.type = type
    this.categoryId = categoryId ?? null
    this.date = date ?? null
  }

  @Field(() => String)
  title: string

  @Field(() => Float)
  value: number

  @Field(() => TransactionType)
  type: TransactionType

  @Field(() => String, { nullable: true })
  categoryId?: string | null

  @Field(() => GraphQLISODateTime, { nullable: true })
  date?: Date | null
}

@InputType()
export class UpdateTransactionInput {
  constructor(
    title?: string | null,
    value?: number | null,
    type?: TransactionType | null,
    categoryId?: string | null,
    date?: Date | null
  ) {
    this.title = title ?? null
    this.value = value ?? null
    this.type = type ?? null
    this.categoryId = categoryId ?? null
    this.date = date ?? null
  }

  @Field(() => String, { nullable: true })
  title?: string | null

  @Field(() => Float, { nullable: true })
  value?: number | null

  @Field(() => TransactionType, { nullable: true })
  type?: TransactionType | null

  @Field(() => String, { nullable: true })
  categoryId?: string | null

  @Field(() => GraphQLISODateTime, { nullable: true })
  date?: Date | null
}

