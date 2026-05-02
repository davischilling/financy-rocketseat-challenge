import { Service } from 'typedi'
import { prismaClient } from '@/infra/prisma/prisma.js'
import type {
  CreateTransactionInput,
  UpdateTransactionInput,
} from '@/domain/dtos/index.js'

const VALID_TYPES = ['INCOME', 'EXPENSE']

@Service()
export class TransactionService {
  async createTransaction(data: CreateTransactionInput, userId: string) {
    if (!VALID_TYPES.includes(data.type)) {
      throw new Error('Transaction type must be INCOME or EXPENSE')
    }

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

    if (data.type != null && !VALID_TYPES.includes(data.type)) {
      throw new Error('Transaction type must be INCOME or EXPENSE')
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

  async findCategory(categoryId: string) {
    return prismaClient.category.findUnique({ where: { id: categoryId } })
  }
}
