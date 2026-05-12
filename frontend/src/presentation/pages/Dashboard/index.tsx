import { useQuery } from '@apollo/client/react'
import { Link } from 'react-router-dom'
import { LIST_TRANSACTIONS } from '@/domain/lib/graphql/queries/transaction'
import { LIST_CATEGORIES } from '@/domain/lib/graphql/queries/category'
import { GET_STATS } from '@/domain/lib/graphql/queries/stats'
import type { Transaction, Category, Stats } from '@/domain/types'
import { Card, CardContent, CardHeader, CardTitle } from '@/presentation/components/ui/card'
import { Button } from '@/presentation/components/ui/button'
import { ArrowUpCircle, ArrowDownCircle, Wallet, Plus, ChevronRight } from 'lucide-react'
import { getCategoryColorClass } from '@/presentation/utils/category-colors'
import { CreateTransactionDialog } from '../Transactions/components/CreateTransactionDialog'
import { useState } from 'react'
import { Separator } from '@/presentation/components/ui/separator'
import { CategoryIcon } from '../Categories'

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
  const { data: statsData, loading: statsLoading } = useQuery<{ stats: Stats }>(GET_STATS)

  const transactions = txData?.listTransactions ?? []
  const categories = catData?.listCategories ?? []
  const stats = statsData?.stats

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
            <div className="flex items-center mb-2 gap-3">
              <Wallet className="h-5 w-5 text-purple-500" />
              <p className="text-xs font-medium text-muted-foreground uppercase tracking-wide">Saldo Total</p>
            </div>
            <p className={"text-2xl font-bold text-grey-600"}>
              {statsLoading ? '...' : formatCurrency(stats?.totalBalance ?? 0)}
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center mb-2 gap-3">
              <ArrowUpCircle className="h-5 w-5 text-brand-base" />
              <p className="text-xs font-medium text-muted-foreground uppercase tracking-wide">Receitas do Mês</p>
            </div>
            <p className="text-2xl font-bold text-grey-600">
              {statsLoading ? '...' : formatCurrency(stats?.monthlyIncome ?? 0)}
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center mb-2 gap-3">
              <ArrowDownCircle className="h-5 w-5 text-red-500" />
              <p className="text-xs font-medium text-muted-foreground uppercase tracking-wide">Despesas do Mês</p>
            </div>
            <p className="text-2xl font-bold text-grey-600">
              {statsLoading ? '...' : formatCurrency(stats?.monthlyExpense ?? 0)}
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
              <Button variant="ghost" size="sm" className="text-[14px] gap-1 text-brand-base">
                Ver todas <ChevronRight className="h-5 w-5" />
              </Button>
            </Link>
          </CardHeader>
          <Separator className='my-0' />
          <CardContent className="space-y-3 mt-3">
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
                  <CategoryIcon icon={tx.category?.icon} color={tx.category?.color} />
                  <div className="flex flex-col gap-1">
                    <p className="text-sm font-medium">{tx.title}</p>
                    <p className="text-xs text-muted-foreground">{formatDate(tx.createdAt)}</p>
                  </div>
                </div>
                <div className="flex items-center gap-3">
                  {tx.category && (
                    <span className={`text-xs px-2 py-1 rounded-full font-medium ${getCategoryColorClass(tx.category.color)}`}>
                      {tx.category.name}
                    </span>
                  )}
                  <div className="flex items-center gap-2">
                    <span className={`text-sm font-semibold`}>
                      {tx.type === 'INCOME' ? '+' : '-'} {formatCurrency(tx.value)}
                    </span>
                    {tx.type === 'INCOME' ?
                      <ArrowUpCircle className="h-5 w-5 text-brand-base" /> :
                      <ArrowDownCircle className="h-5 w-5 text-red-500" />
                    }
                  </div>
                </div>
              </div>
            ))}
          </CardContent>
          <Separator className='my-0' />
          <Button
            variant="ghost"
            size="sm"
            className="w-full my-5 gap-1 text-brand-base text-sm"
            onClick={() => setOpenDialog(true)}
          >
            <Plus className="h-5 w-5" /> Nova transação
          </Button>
        </Card>

        {/* Categories */}
        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-3">
            <CardTitle className="text-sm font-semibold uppercase tracking-wide text-muted-foreground">
              Categorias
            </CardTitle>
            <Link to="/categories">
              <Button variant="ghost" size="sm" className="text-[14px] gap-1 text-brand-base">
                Gerenciar <ChevronRight className="h-5 w-5" />
              </Button>
            </Link>
          </CardHeader>
          <CardContent className="space-y-2">
            {categories.length === 0 && (
              <p className="text-sm text-muted-foreground text-center py-4">Nenhuma categoria.</p>
            )}
            {categoryStats.slice(0, 5).map((cat) => (
              <div key={cat.id} className="flex items-center justify-between py-1">
                <span className={`text-xs px-2.5 py-1 rounded-full font-medium shrink-0 ${getCategoryColorClass(cat.color)}`}>
                  {cat.name}
                </span>
                <div className='flex-row gap-3 items-center hidden sm:flex'>
                  <span className="text-xs text-muted-foreground whitespace-nowrap">{cat.count} {cat.count === 1 ? 'item' : 'itens'}</span>
                  <span className="text-xs font-semibold whitespace-nowrap ml-auto">{formatCurrency(cat.total)}</span>
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
