import {
  Arg,
  FieldResolver,
  Mutation,
  Query,
  Resolver,
  Root,
  UseMiddleware,
} from 'type-graphql'
import { Service, Inject } from 'typedi'
import { CategoryModel, StatsModel, TransactionModel } from '@/domain/models/index.js'
import {
  CreateTransactionInput,
  UpdateTransactionInput,
} from '@/domain/dtos/index.js'
import { TransactionService } from '../services/transaction.service.js'
import { isAuth } from '../middlewares/auth.middleware.js'
import { GqlUser } from '@/shared/decorators/user.decorator.js'
import { User } from '@prisma/client'

@Service()
@Resolver(() => TransactionModel)
@UseMiddleware(isAuth)
export class TransactionResolver {
  @Inject(() => TransactionService)
  private transactionService!: TransactionService

  @Mutation(() => TransactionModel)
  async createTransaction(
    @Arg('data', () => CreateTransactionInput) data: CreateTransactionInput,
    @GqlUser() user: User
  ): Promise<TransactionModel> {
    return this.transactionService.createTransaction(data, user.id)
  }

  @Query(() => [TransactionModel])
  async listTransactions(
    @GqlUser() user: User
  ): Promise<TransactionModel[]> {
    return this.transactionService.listTransactions(user.id)
  }

  @Query(() => TransactionModel)
  async findTransaction(
    @Arg('id', () => String) id: string,
    @GqlUser() user: User
  ): Promise<TransactionModel> {
    return this.transactionService.findTransaction(id, user.id)
  }

  @Mutation(() => TransactionModel)
  async updateTransaction(
    @Arg('id', () => String) id: string,
    @Arg('data', () => UpdateTransactionInput) data: UpdateTransactionInput,
    @GqlUser() user: User
  ): Promise<TransactionModel> {
    return this.transactionService.updateTransaction(id, data, user.id)
  }

  @Mutation(() => TransactionModel)
  async deleteTransaction(
    @Arg('id', () => String) id: string,
    @GqlUser() user: User
  ): Promise<TransactionModel> {
    return this.transactionService.deleteTransaction(id, user.id)
  }

  @Query(() => StatsModel)
  async stats(@GqlUser() user: User): Promise<StatsModel> {
    return this.transactionService.getStats(user.id)
  }

  @FieldResolver(() => CategoryModel, { nullable: true })
  async category(
    @Root() transaction: TransactionModel
  ): Promise<CategoryModel | null> {
    if (!transaction.categoryId) return null
    return this.transactionService.findCategory(transaction.categoryId)
  }
}
