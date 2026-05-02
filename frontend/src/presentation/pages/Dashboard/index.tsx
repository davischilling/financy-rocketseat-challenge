import { useQuery } from '@apollo/client/react'
import { Link } from 'react-router-dom'
import { LIST_TRANSACTIONS } from '@/domain/lib/graphql/queries/transaction'
import { LIST_CATEGORIES } from '@/domain/lib/graphql/queries/category'
import type { Transaction, Category } from '@/domain/types'
import { Card, CardContent, CardHeader, CardTitle } from '@/presentation/components/ui/card'
import { Button } from '@/presentation/components/ui/button'
import { ArrowUpCircle, ArrowDownCircle, Wallet, Plus, ArrowRight } from 'lucide-react'
import { getCategoryColorClass } from '@/presentation/utils/category-colors'
import { CreateTransactionDialog } from '../Transactions/components/CreateTransactionDialog'
import { useState } from 'react'

function formatCurrency(value: number) {
  return new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(value)
}

function formatDate(date: string) {
  return new Date(date).toLocaleDateString('pt-BR')
}

export function Dashboard() {
  const [openDialog, setOpenDialog] = useState(false)
  const { data: txData, loading: txLoading, refetch } = useQuery<{ listTransactions: Transaction[] }>(LIST_TRANSACTIONS)
  const { data: catData } = useQuery<{ listCategories: Category[] }>(LIST_CATEGORIES)

  const transactions = txData?.listTransactions ?? []
  const categories = catData?.listCategories ?? []

  const totalBalance = transactions.reduce((acc, t) => {
    return t.type === 'INCOME' ? acc + t.value : acc - t.value
  }, 0)

  const monthlyIncome = transactions
    .filter((t) => {
      const d = new Date(t.createdAt)
      const now = new Date()
      return t.type === 'INCOME' && d.getMonth() === now.getMonth() && d.getFullYear() === now.getFullYear()
    })
    .reduce((acc, t) => acc + t.value, 0)

  const monthlyExpenses = transactions
    .filter((t) => {
      const d = new Date(t.createdAt)
      const now = new Date()
      return t.type === 'EXPENSE' && d.getMonth() === now.getMonth() && d.getFullYear() === now.getFullYear()
    })
    .reduce((acc, t) => acc + t.value, 0)

  const recentTransactions = transactions.slice(0, 5)

  const categoryStats = categories.map((cat) => ({
    ...cat,
    count: transactions.filter((t) => t.categoryId === cat.id).length,
    total: transactions
      .filter((t) => t.categoryId === cat.id)
      .reduce((acc, t) => (t.type === 'EXPENSE' ? acc + t.value : acc), 0),
  }))

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-foreground">Dashboard</h1>
          <p className="text-sm text-muted-foreground">Visão geral das suas finanças</p>
        </div>
      </div>

      {/* Summary cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center justify-between mb-2">
              <p className="text-xs font-medium text-muted-foreground uppercase tracking-wide">Saldo Total</p>
              <Wallet className="h-4 w-4 text-muted-foreground" />
            </div>
            <p className={`text-2xl font-bold ${totalBalance >= 0 ? 'text-green-600' : 'text-red-600'}`}>
              {txLoading ? '...' : formatCurrency(totalBalance)}
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center justify-between mb-2">
              <p className="text-xs font-medium text-muted-foreground uppercase tracking-wide">Receitas do Mês</p>
              <ArrowUpCircle className="h-4 w-4 text-green-500" />
            </div>
            <p className="text-2xl font-bold text-green-600">
              {txLoading ? '...' : formatCurrency(monthlyIncome)}
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center justify-between mb-2">
              <p className="text-xs font-medium text-muted-foreground uppercase tracking-wide">Despesas do Mês</p>
              <ArrowDownCircle className="h-4 w-4 text-red-500" />
            </div>
            <p className="text-2xl font-bold text-red-600">
              {txLoading ? '...' : formatCurrency(monthlyExpenses)}
            </p>
          </CardContent>
        </Card>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Recent transactions */}
        <Card className="lg:col-span-2">
          <CardHeader className="flex flex-row items-center justify-between pb-3">
            <CardTitle className="text-sm font-semibold uppercase tracking-wide text-muted-foreground">
              Transações Recentes
            </CardTitle>
            <Link to="/transactions">
              <Button variant="ghost" size="sm" className="text-xs gap-1">
                Ver todas <ArrowRight className="h-3 w-3" />
              </Button>
            </Link>
          </CardHeader>
          <CardContent className="space-y-3">
            {txLoading && (
              <div className="space-y-3">
                {Array.from({ length: 4 }).map((_, i) => (
                  <div key={i} className="h-10 rounded bg-muted animate-pulse" />
                ))}
              </div>
            )}
            {!txLoading && recentTransactions.length === 0 && (
              <p className="text-sm text-muted-foreground text-center py-4">Nenhuma transação ainda.</p>
            )}
            {!txLoading && recentTransactions.map((tx) => (
              <div key={tx.id} className="flex items-center justify-between py-2 border-b border-border last:border-0">
                <div className="flex items-center gap-3">
                  <div className={`w-7 h-7 rounded-full flex items-center justify-center text-xs ${getCategoryColorClass(tx.category?.color)}`}>
                    {tx.category?.name?.[0]?.toUpperCase() ?? '?'}
                  </div>
                  <div>
                    <p className="text-sm font-medium">{tx.title}</p>
                    <p className="text-xs text-muted-foreground">{formatDate(tx.createdAt)}</p>
                  </div>
                </div>
                <div className="flex items-center gap-3">
                  {tx.category && (
                    <span className={`text-xs px-2 py-0.5 rounded-full font-medium ${getCategoryColorClass(tx.category.color)}`}>
                      {tx.category.name}
                    </span>
                  )}
                  <span className={`text-sm font-semibold ${tx.type === 'INCOME' ? 'text-green-600' : 'text-red-600'}`}>
                    {tx.type === 'INCOME' ? '+' : '-'} {formatCurrency(tx.value)}
                  </span>
                </div>
              </div>
            ))}
            <Button
              variant="outline"
              size="sm"
              className="w-full mt-2 gap-2"
              onClick={() => setOpenDialog(true)}
            >
              <Plus className="h-3 w-3" /> Nova transação
            </Button>
          </CardContent>
        </Card>

        {/* Categories */}
        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-3">
            <CardTitle className="text-sm font-semibold uppercase tracking-wide text-muted-foreground">
              Categorias
            </CardTitle>
            <Link to="/categories">
              <Button variant="ghost" size="sm" className="text-xs gap-1">
                Gerenciar <ArrowRight className="h-3 w-3" />
              </Button>
            </Link>
          </CardHeader>
          <CardContent className="space-y-2">
            {categories.length === 0 && (
              <p className="text-sm text-muted-foreground text-center py-4">Nenhuma categoria.</p>
            )}
            {categoryStats.slice(0, 5).map((cat) => (
              <div key={cat.id} className="flex items-center justify-between">
                <span className={`text-xs px-2 py-0.5 rounded-full font-medium ${getCategoryColorClass(cat.color)}`}>
                  {cat.name}
                </span>
                <div className="text-right">
                  <p className="text-xs text-muted-foreground">{cat.count} itens</p>
                  {cat.total > 0 && <p className="text-xs font-medium">{formatCurrency(cat.total)}</p>}
                </div>
              </div>
            ))}
          </CardContent>
        </Card>
      </div>

      <CreateTransactionDialog
        open={openDialog}
        onOpenChange={setOpenDialog}
        categories={categories}
        onCreated={() => refetch()}
      />
    </div>
  )
}
