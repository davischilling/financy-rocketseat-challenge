import { Service } from 'typedi'
import { prismaClient } from '@/infra/prisma/prisma.js'
import type {
  CreateCategoryInput,
  UpdateCategoryInput,
} from '@/domain/dtos/index.js'

@Service()
export class CategoryService {
  async createCategory(data: CreateCategoryInput, userId: string) {
    return prismaClient.category.create({
      data: {
        name: data.name,
        description: data.description ?? null,
        icon: data.icon ?? null,
        color: data.color ?? null,
        userId,
      },
    })
  }

  async listCategories(userId: string) {
    return prismaClient.category.findMany({
      where: { userId },
      orderBy: { createdAt: 'desc' },
    })
  }

  async findCategory(id: string, userId: string) {
    const category = await prismaClient.category.findFirst({
      where: { id, userId },
    })
    if (!category) {
      throw new Error('Category not found')
    }
    return category
  }

  async updateCategory(
    id: string,
    data: UpdateCategoryInput,
    userId: string
  ) {
    const category = await prismaClient.category.findFirst({
      where: { id, userId },
    })
    if (!category) {
      throw new Error('Category not found')
    }

    return prismaClient.category.update({
      where: { id },
      data: {
        name: data.name,
        ...(data.description !== undefined && { description: data.description }),
        ...(data.icon !== undefined && { icon: data.icon }),
        ...(data.color !== undefined && { color: data.color }),
      },
    })
  }

  async deleteCategory(id: string, userId: string) {
    const category = await prismaClient.category.findFirst({
      where: { id, userId },
    })
    if (!category) {
      throw new Error('Category not found')
    }

    return prismaClient.category.delete({ where: { id } })
  }
}
