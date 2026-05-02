import { Field, Float, Int, ObjectType } from 'type-graphql'
import { CategoryModel } from './category.model.js'

@ObjectType()
export class StatsModel {
  @Field(() => Int)
  totalCategoriesCount!: number

  @Field(() => Int)
  totalTransactionsCount!: number

  @Field(() => CategoryModel, { nullable: true })
  mostUsedCategory?: CategoryModel | null

  @Field(() => Float)
  totalBalance!: number

  @Field(() => Float)
  monthlyIncome!: number

  @Field(() => Float)
  monthlyExpense!: number
}
