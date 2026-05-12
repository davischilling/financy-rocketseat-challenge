import { useState, useMemo } from 'react'
import { useQuery, useMutation } from '@apollo/client/react'
import { toast } from 'sonner'
import { LIST_TRANSACTIONS } from '@/domain/lib/graphql/queries/transaction'
import { LIST_CATEGORIES } from '@/domain/lib/graphql/queries/category'
import { DELETE_TRANSACTION } from '@/domain/lib/graphql/mutations/transaction'
import type { Transaction, Category } from '@/domain/types'
import { Button } from '@/presentation/components/ui/button'
import { Input } from '@/presentation/components/ui/input'
import {
  Select, SelectContent, SelectItem, SelectTrigger, SelectValue,
} from '@/presentation/components/ui/select'
import { CreateTransactionDialog } from './components/CreateTransactionDialog'
import { EditTransactionDialog } from './components/EditTransactionDialog'
import {
  Plus, Trash, SquarePen, Search, Tag,
  CircleArrowUp, CircleArrowDown,
  Briefcase, Car, Heart, PiggyBank, ShoppingCart, Ticket, Gift, Utensils,
  Coffee, Home, Wrench, Dumbbell, Book, ShoppingBag, Monitor, Receipt,
} from 'lucide-react'
import { getCategoryColorClass } from '@/presentation/utils/category-colors'
import { cn } from '@/presentation/utils/utils'

const PAGE_SIZE = 10

const ICON_MAP: Record<string, React.ComponentType<{ className?: string }>> = {
  'briefcase': Briefcase, 'car': Car, 'heart': Heart, 'piggy-bank': PiggyBank,
  'shopping-cart': ShoppingCart, 'ticket': Ticket, 'gift': Gift, 'utensils': Utensils,
  'coffee': Coffee, 'home': Home, 'wrench': Wrench, 'dumbbell': Dumbbell,
  'book': Book, 'shopping-bag': ShoppingBag, 'monitor': Monitor, 'receipt': Receipt,
}

function TxCategoryIcon({ icon, color }: { icon?: string | null; color?: string | null }) {
  const Icon = icon ? ICON_MAP[icon] : null
  return (
    <div className={cn('w-8 h-8 rounded-lg flex items-center justify-center shrink-0', getCategoryColorClass(color))}>
      {Icon ? <Icon className="h-4 w-4" /> : <Tag className="h-4 w-4" />}
    </div>
  )
}

function formatCurrency(value: number) {
  return new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(value)
}

function formatDate(date: string) {
  return new Date(date).toLocaleDateString('pt-BR', { day: '2-digit', month: '2-digit', year: '2-digit' })
}

function getPeriodKey(dateStr: string) {
  const d = new Date(dateStr)
  return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}`
}

function formatPeriod(key: string) {
  const [year, month] = key.split('-').map(Number)
  const name = new Date(year, month - 1, 1).toLocaleDateString('pt-BR', { month: 'long' })
  return `${name.charAt(0).toUpperCase() + name.slice(1)} / ${year}`
}

export function TransactionsPage() {
  const [createOpen, setCreateOpen] = useState(false)
  const [editOpen, setEditOpen] = useState(false)
  const [selected, setSelected] = useState<Transaction | null>(null)
  const [search, setSearch] = useState('')
  const [typeFilter, setTypeFilter] = useState('all')
  const [categoryFilter, setCategoryFilter] = useState('all')
  const [periodFilter, setPeriodFilter] = useState(() => {
    const now = new Date()
    return `${now.getFullYear()}-${String(now.getMonth() + 1).padStart(2, '0')}`
  })
  const [page, setPage] = useState(1)

  const { data: txData, loading, refetch } = useQuery<{ listTransactions: Transaction[] }>(LIST_TRANSACTIONS)
  const { data: catData } = useQuery<{ listCategories: Category[] }>(LIST_CATEGORIES)

  const [deleteTransaction] = useMutation(DELETE_TRANSACTION, {
    onCompleted() { toast.success('Transação excluída'); refetch() },
    onError(err) { toast.error(err.message) },
  })

  const transactions = txData?.listTransactions ?? []
  const categories = catData?.listCategories ?? []

  const periodOptions = useMemo(() => {
    const now = new Date()
    const currentKey = `${now.getFullYear()}-${String(now.getMonth() + 1).padStart(2, '0')}`
    const keys = new Set<string>([currentKey])
    transactions.forEach((t) => keys.add(getPeriodKey(t.createdAt)))
    return Array.from(keys).sort((a, b) => b.localeCompare(a))
  }, [transactions])

  const filtered = useMemo(() => {
    return transactions.filter((t) => {
      const matchesSearch = t.title.toLowerCase().includes(search.toLowerCase())
      const matchesType = typeFilter === 'all' || t.type === typeFilter
      const matchesCategory = categoryFilter === 'all' || t.categoryId === categoryFilter
      const matchesPeriod = getPeriodKey(t.createdAt) === periodFilter
      return matchesSearch && matchesType && matchesCategory && matchesPeriod
    })
  }, [transactions, search, typeFilter, categoryFilter, periodFilter])

  const totalPages = Math.max(1, Math.ceil(filtered.length / PAGE_SIZE))
  const paginated = filtered.slice((page - 1) * PAGE_SIZE, page * PAGE_SIZE)

  const handleDelete = (id: string) => {
    if (confirm('Deseja excluir esta transação?')) {
      deleteTransaction({ variables: { id } })
    }
  }

  const handleEdit = (tx: Transaction) => {
    setSelected(tx)
    setEditOpen(true)
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold">Transações</h1>
          <p className="text-sm text-muted-foreground">Gerencie todas as suas transações financeiras</p>
        </div>
        <Button onClick={() => setCreateOpen(true)} className="gap-2">
          <Plus className="h-4 w-4" /> Nova transação
        </Button>
      </div>

      {/* Filters */}
      <div className="bg-white rounded-xl border border-border p-5">
        <div className="grid grid-cols-4 gap-3">
          <div className="space-y-1.5">
            <p className="text-sm font-medium">Buscar</p>
            <div className="relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Buscar por descrição"
                value={search}
                onChange={(e) => { setSearch(e.target.value); setPage(1) }}
                className="pl-9 py-5"
              />
            </div>
          </div>

          <div className="space-y-1.5">
            <p className="text-sm font-medium">Tipo</p>
            <Select value={typeFilter} onValueChange={(v) => { setTypeFilter(v); setPage(1) }}>
              <SelectTrigger>
                <SelectValue placeholder="Tipo" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">Todos</SelectItem>
                <SelectItem value="INCOME">Entrada</SelectItem>
                <SelectItem value="EXPENSE">Saída</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-1.5">
            <p className="text-sm font-medium">Categoria</p>
            <Select value={categoryFilter} onValueChange={(v) => { setCategoryFilter(v); setPage(1) }}>
              <SelectTrigger>
                <SelectValue placeholder="Categoria" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">Todas</SelectItem>
                {categories.map((cat) => (
                  <SelectItem key={cat.id} value={cat.id}>{cat.name}</SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-1.5">
            <p className="text-sm font-medium">Período</p>
            <Select value={periodFilter} onValueChange={(v) => { setPeriodFilter(v); setPage(1) }}>
              <SelectTrigger>
                <SelectValue placeholder="Período" />
              </SelectTrigger>
              <SelectContent>
                {periodOptions.map((key) => (
                  <SelectItem key={key} value={key}>{formatPeriod(key)}</SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        </div>
      </div>

      {/* Table */}
      <div className="bg-white rounded-xl border border-border overflow-hidden">
        <table className="w-full text-sm">
          <thead>
            <tr className="border-b border-border">
              <th className="text-left px-5 py-4 text-xs font-semibold text-muted-foreground uppercase tracking-wide">Descrição</th>
              <th className="text-left px-5 py-4 text-xs font-semibold text-muted-foreground uppercase tracking-wide">Data</th>
              <th className="text-left px-5 py-4 text-xs font-semibold text-muted-foreground uppercase tracking-wide">Categoria</th>
              <th className="text-left px-5 py-4 text-xs font-semibold text-muted-foreground uppercase tracking-wide">Tipo</th>
              <th className="text-right px-5 py-4 text-xs font-semibold text-muted-foreground uppercase tracking-wide">Valor</th>
              <th className="text-right px-5 py-4 text-xs font-semibold text-muted-foreground uppercase tracking-wide">Ações</th>
            </tr>
          </thead>
          <tbody>
            {loading && (
              <tr>
                <td colSpan={6} className="text-center py-12 text-muted-foreground">Carregando...</td>
              </tr>
            )}
            {!loading && paginated.length === 0 && (
              <tr>
                <td colSpan={6} className="text-center py-12 text-muted-foreground">Nenhuma transação encontrada.</td>
              </tr>
            )}
            {paginated.map((tx) => (
              <tr key={tx.id} className="border-b border-border last:border-0 hover:bg-muted/20 transition-colors">
                <td className="px-5 py-5">
                  <div className="flex items-center gap-3">
                    <TxCategoryIcon icon={tx.category?.icon} color={tx.category?.color} />
                    <span className="font-medium">{tx.title}</span>
                  </div>
                </td>
                <td className="px-5 py-5 text-muted-foreground">{formatDate(tx.createdAt)}</td>
                <td className="px-5 py-5">
                  {tx.category ? (
                    <span className={cn('inline-flex items-center px-2.5 py-1 rounded-full text-xs font-medium', getCategoryColorClass(tx.category.color))}>
                      {tx.category.name}
                    </span>
                  ) : (
                    <span className="text-muted-foreground text-xs">—</span>
                  )}
                </td>
                <td className="px-5 py-5">
                  <div className="flex items-center gap-1.5">
                    {tx.type === 'INCOME' ? (
                      <CircleArrowUp className="h-4 w-4 text-green-600" />
                    ) : (
                      <CircleArrowDown className="h-4 w-4 text-red-dark" />
                    )}
                    <span className={cn('text-xs font-medium', tx.type === 'INCOME' ? 'text-green-600' : 'text-red-dark')}>
                      {tx.type === 'INCOME' ? 'Entrada' : 'Saída'}
                    </span>
                  </div>
                </td>
                <td className={cn('px-5 py-5 text-right font-semibold')}>
                  {tx.type === 'INCOME' ? '+' : '-'} {formatCurrency(tx.value)}
                </td>
                <td className="px-5 py-5">
                  <div className="flex items-center justify-end gap-2">
                    <button
                      onClick={() => handleDelete(tx.id)}
                      className="w-8 h-8 rounded flex items-center justify-center border border-border text-muted-foreground hover:text-destructive hover:bg-destructive/10 transition-colors"
                    >
                      <Trash className="h-4 w-4 text-danger" />
                    </button>
                    <button
                      onClick={() => handleEdit(tx)}
                      className="w-8 h-8 rounded flex items-center justify-center border border-border text-muted-foreground hover:text-primary hover:bg-primary/10 transition-colors"
                    >
                      <SquarePen className="h-4 w-4" />
                    </button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>

        {/* Pagination */}
        {filtered.length > 0 && (
          <div className="flex items-center justify-between px-4 py-3 border-t border-border">
            <p className="text-xs text-muted-foreground">
              {(page - 1) * PAGE_SIZE + 1} a {Math.min(page * PAGE_SIZE, filtered.length)} | {filtered.length} resultados
            </p>
            <div className="flex items-center gap-2">
              <button
                className="w-8 h-8 rounded border border-border flex items-center justify-center text-sm text-muted-foreground hover:bg-muted/50 disabled:opacity-40 disabled:cursor-not-allowed transition-colors"
                disabled={page === 1}
                onClick={() => setPage(page - 1)}
              >‹</button>
              {Array.from({ length: Math.min(totalPages, 5) }, (_, i) => i + 1).map((p) => (
                <button
                  key={p}
                  onClick={() => setPage(p)}
                  className={cn(
                    'w-8 h-8 rounded border text-xs font-medium transition-colors',
                    page === p
                      ? 'bg-primary text-white border-primary'
                      : 'border-border text-foreground hover:bg-muted/50'
                  )}
                >
                  {p}
                </button>
              ))}
              <button
                className="w-8 h-8 rounded border border-border flex items-center justify-center text-sm text-muted-foreground hover:bg-muted/50 disabled:opacity-40 disabled:cursor-not-allowed transition-colors"
                disabled={page === totalPages}
                onClick={() => setPage(page + 1)}
              >›</button>
            </div>
          </div>
        )}
      </div>

      <CreateTransactionDialog
        open={createOpen}
        onOpenChange={setCreateOpen}
        categories={categories}
        onCreated={() => refetch()}
      />
      <EditTransactionDialog
        open={editOpen}
        onOpenChange={setEditOpen}
        transaction={selected}
        categories={categories}
        onUpdated={() => refetch()}
      />
    </div>
  )
}
