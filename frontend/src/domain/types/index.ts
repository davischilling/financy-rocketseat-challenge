export interface User {
  id: string
  name: string
  email: string
  createdAt?: string
  updatedAt?: string
}

export interface RegisterInput {
  name: string
  email: string
  password: string
}

export interface LoginInput {
  email: string
  password: string
}

export interface Category {
  id: string
  name: string
  description?: string | null
  icon?: string | null
  color?: string | null
  userId: string
  createdAt: string
  updatedAt: string
}

export interface Transaction {
  id: string
  title: string
  value: number
  type: 'INCOME' | 'EXPENSE'
  categoryId?: string | null
  category?: Category | null
  userId: string
  createdAt: string
  updatedAt: string
}

export interface CreateTransactionInput {
  title: string
  value: number
  type: string
  categoryId?: string | null
  date?: string | null
}

export interface UpdateTransactionInput {
  title?: string | null
  value?: number | null
  type?: string | null
  categoryId?: string | null
  date?: string | null
}

export interface CreateCategoryInput {
  name: string
  description?: string | null
  icon?: string | null
  color?: string | null
}

export interface UpdateCategoryInput {
  name: string
  description?: string | null
  icon?: string | null
  color?: string | null
}

export interface Stats {
  totalCategoriesCount: number
  totalTransactionsCount: number
  mostUsedCategory: Pick<Category, 'id' | 'name' | 'icon' | 'color'> | null
  totalBalance: number
  monthlyIncome: number
  monthlyExpense: number
}
