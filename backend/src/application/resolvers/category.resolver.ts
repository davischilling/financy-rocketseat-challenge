import {
  Arg,
  Mutation,
  Query,
  Resolver,
  UseMiddleware,
} from 'type-graphql'
import { Service, Inject } from 'typedi'
import { CategoryModel } from '@/domain/models/index.js'
import {
  CreateCategoryInput,
  UpdateCategoryInput,
} from '@/domain/dtos/index.js'
import { CategoryService } from '../services/category.service.js'
import { isAuth } from '../middlewares/auth.middleware.js'
import { GqlUser } from '@/shared/decorators/user.decorator.js'
import { User } from '@prisma/client'

@Service()
@Resolver(() => CategoryModel)
@UseMiddleware(isAuth)
export class CategoryResolver {
  @Inject(() => CategoryService)
  private categoryService!: CategoryService

  @Mutation(() => CategoryModel)
  async createCategory(
    @Arg('data', () => CreateCategoryInput) data: CreateCategoryInput,
    @GqlUser() user: User
  ): Promise<CategoryModel> {
    return this.categoryService.createCategory(data, user.id)
  }

  @Query(() => [CategoryModel])
  async listCategories(@GqlUser() user: User): Promise<CategoryModel[]> {
    return this.categoryService.listCategories(user.id)
  }

  @Query(() => CategoryModel)
  async findCategory(
    @Arg('id', () => String) id: string,
    @GqlUser() user: User
  ): Promise<CategoryModel> {
    return this.categoryService.findCategory(id, user.id)
  }

  @Mutation(() => CategoryModel)
  async updateCategory(
    @Arg('id', () => String) id: string,
    @Arg('data', () => UpdateCategoryInput) data: UpdateCategoryInput,
    @GqlUser() user: User
  ): Promise<CategoryModel> {
    return this.categoryService.updateCategory(id, data, user.id)
  }

  @Mutation(() => CategoryModel)
  async deleteCategory(
    @Arg('id', () => String) id: string,
    @GqlUser() user: User
  ): Promise<CategoryModel> {
    return this.categoryService.deleteCategory(id, user.id)
  }
}
