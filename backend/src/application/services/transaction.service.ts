import { Service } from 'typedi'
import { prismaClient } from '@/infra/prisma/prisma.js'
import type {
  CreateTransactionInput,
  UpdateTransactionInput,
} from '@/domain/dtos/index.js'

@Service()
export class TransactionService {
  async createTransaction(data: CreateTransactionInput, userId: string) {
    if (data.categoryId) {
      const category = await prismaClient.category.findFirst({
        where: { id: data.categoryId, userId },
      })
      if (!category) {
        throw new Error('Category not found')
      }
    }

    return prismaClient.transaction.create({
      data: {
        title: data.title,
        value: data.value,
        type: data.type,
        categoryId: data.categoryId ?? null,
        userId,
        ...(data.date != null && { createdAt: data.date }),
      },
    })
  }

  async listTransactions(userId: string) {
    return prismaClient.transaction.findMany({
      where: { userId },
      orderBy: { createdAt: 'desc' },
    })
  }

  async findTransaction(id: string, userId: string) {
    const transaction = await prismaClient.transaction.findFirst({
      where: { id, userId },
    })
    if (!transaction) {
      throw new Error('Transaction not found')
    }
    return transaction
  }

  async updateTransaction(
    id: string,
    data: UpdateTransactionInput,
    userId: string
  ) {
    const transaction = await prismaClient.transaction.findFirst({
      where: { id, userId },
    })
    if (!transaction) {
      throw new Error('Transaction not found')
    }

    if (data.categoryId != null) {
      const category = await prismaClient.category.findFirst({
        where: { id: data.categoryId, userId },
      })
      if (!category) {
        throw new Error('Category not found')
      }
    }

    return prismaClient.transaction.update({
      where: { id },
      data: {
        ...(data.title != null && { title: data.title }),
        ...(data.value != null && { value: data.value }),
        ...(data.type != null && { type: data.type }),
        ...(data.categoryId !== undefined && { categoryId: data.categoryId }),
        ...(data.date != null && { createdAt: data.date }),
      },
    })
  }

  async deleteTransaction(id: string, userId: string) {
    const transaction = await prismaClient.transaction.findFirst({
      where: { id, userId },
    })
    if (!transaction) {
      throw new Error('Transaction not found')
    }

    return prismaClient.transaction.delete({ where: { id } })
  }

  async getStats(userId: string) {
    const now = new Date()
    const startOfMonth = new Date(now.getFullYear(), now.getMonth(), 1)

    const [
      totalCategoriesCount,
      totalTransactionsCount,
      totalIncomeAgg,
      totalExpenseAgg,
      monthlyIncomeAgg,
      monthlyExpenseAgg,
      topCategoryGroup,
    ] = await Promise.all([
      prismaClient.category.count({ where: { userId } }),
      prismaClient.transaction.count({ where: { userId } }),
      prismaClient.transaction.aggregate({
        where: { userId, type: 'INCOME' },
        _sum: { value: true },
      }),
      prismaClient.transaction.aggregate({
        where: { userId, type: 'EXPENSE' },
        _sum: { value: true },
      }),
      prismaClient.transaction.aggregate({
        where: { userId, type: 'INCOME', createdAt: { gte: startOfMonth } },
        _sum: { value: true },
      }),
      prismaClient.transaction.aggregate({
        where: { userId, type: 'EXPENSE', createdAt: { gte: startOfMonth } },
        _sum: { value: true },
      }),
      prismaClient.transaction.groupBy({
        by: ['categoryId'],
        where: { userId, categoryId: { not: null } },
        _count: { id: true },
        orderBy: { _count: { id: 'desc' } },
        take: 1,
      }),
    ])

    const totalBalance =
      (totalIncomeAgg._sum.value ?? 0) - (totalExpenseAgg._sum.value ?? 0)
    const monthlyIncome = monthlyIncomeAgg._sum.value ?? 0
    const monthlyExpense = monthlyExpenseAgg._sum.value ?? 0

    let mostUsedCategory = null
    if (topCategoryGroup[0]?.categoryId) {
      mostUsedCategory = await prismaClient.category.findUnique({
        where: { id: topCategoryGroup[0].categoryId },
      })
    }

    return {
      totalCategoriesCount,
      totalTransactionsCount,
      mostUsedCategory,
      totalBalance,
      monthlyIncome,
      monthlyExpense,
    }
  }

  async findCategory(categoryId: string) {
    return prismaClient.category.findUnique({ where: { id: categoryId } })
  }
}
