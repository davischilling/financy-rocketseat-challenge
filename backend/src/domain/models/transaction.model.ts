import { Field, Float, GraphQLISODateTime, ID, ObjectType } from 'type-graphql'
import { TransactionType } from '@/domain/dtos/index.js'
import { CategoryModel } from './category.model.js'

@ObjectType()
export class TransactionModel {
  @Field(() => ID)
  id!: string

  @Field(() => String)
  title!: string

  @Field(() => Float)
  value!: number

  @Field(() => TransactionType)
  type!: TransactionType

  @Field(() => String, { nullable: true })
  categoryId?: string | null

  @Field(() => CategoryModel, { nullable: true })
  category?: CategoryModel | null

  @Field(() => String)
  userId!: string

  @Field(() => GraphQLISODateTime)
  createdAt!: Date

  @Field(() => GraphQLISODateTime)
  updatedAt!: Date
}
