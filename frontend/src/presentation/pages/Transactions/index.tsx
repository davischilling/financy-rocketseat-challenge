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
import { Plus, Trash2, Pencil, ArrowUpCircle, ArrowDownCircle, Search } from 'lucide-react'
import { getCategoryColorClass } from '@/presentation/utils/category-colors'

const PAGE_SIZE = 10

function formatCurrency(value: number) {
  return new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(value)
}

function formatDate(date: string) {
  return new Date(date).toLocaleDateString('pt-BR')
}

export function TransactionsPage() {
  const [createOpen, setCreateOpen] = useState(false)
  const [editOpen, setEditOpen] = useState(false)
  const [selected, setSelected] = useState<Transaction | null>(null)
  const [search, setSearch] = useState('')
  const [typeFilter, setTypeFilter] = useState('all')
  const [categoryFilter, setCategoryFilter] = useState('all')
  const [page, setPage] = useState(1)

  const { data: txData, loading, refetch } = useQuery<{ listTransactions: Transaction[] }>(LIST_TRANSACTIONS)
  const { data: catData } = useQuery<{ listCategories: Category[] }>(LIST_CATEGORIES)

  const [deleteTransaction] = useMutation(DELETE_TRANSACTION, {
    onCompleted() { toast.success('Transação excluída'); refetch() },
    onError(err) { toast.error(err.message) },
  })

  const transactions = txData?.listTransactions ?? []
  const categories = catData?.listCategories ?? []

  const filtered = useMemo(() => {
    return transactions.filter((t) => {
      const matchesSearch = t.title.toLowerCase().includes(search.toLowerCase())
      const matchesType = typeFilter === 'all' || t.type === typeFilter
      const matchesCategory = categoryFilter === 'all' || t.categoryId === categoryFilter
      return matchesSearch && matchesType && matchesCategory
    })
  }, [transactions, search, typeFilter, categoryFilter])

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
      <div className="flex flex-wrap gap-3">
        <div className="relative flex-1 min-w-48">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="Buscar por descrição"
            value={search}
            onChange={(e) => { setSearch(e.target.value); setPage(1) }}
            className="pl-9"
          />
        </div>
        <Select value={typeFilter} onValueChange={(v) => { setTypeFilter(v); setPage(1) }}>
          <SelectTrigger className="w-36">
            <SelectValue placeholder="Tipo" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">Todos</SelectItem>
            <SelectItem value="INCOME">Entrada</SelectItem>
            <SelectItem value="EXPENSE">Saída</SelectItem>
          </SelectContent>
        </Select>
        <Select value={categoryFilter} onValueChange={(v) => { setCategoryFilter(v); setPage(1) }}>
          <SelectTrigger className="w-40">
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

      {/* Table */}
      <div className="bg-white rounded-xl border border-border overflow-hidden">
        <table className="w-full text-sm">
          <thead>
            <tr className="border-b border-border bg-muted/30">
              <th className="text-left px-4 py-3 text-xs font-semibold text-muted-foreground uppercase tracking-wide">Descrição</th>
              <th className="text-left px-4 py-3 text-xs font-semibold text-muted-foreground uppercase tracking-wide">Data</th>
              <th className="text-left px-4 py-3 text-xs font-semibold text-muted-foreground uppercase tracking-wide">Categoria</th>
              <th className="text-left px-4 py-3 text-xs font-semibold text-muted-foreground uppercase tracking-wide">Tipo</th>
              <th className="text-right px-4 py-3 text-xs font-semibold text-muted-foreground uppercase tracking-wide">Valor</th>
              <th className="text-right px-4 py-3 text-xs font-semibold text-muted-foreground uppercase tracking-wide">Ações</th>
            </tr>
          </thead>
          <tbody>
            {loading && (
              <tr>
                <td colSpan={6} className="text-center py-12 text-muted-foreground">
                  Carregando...
                </td>
              </tr>
            )}
            {!loading && paginated.length === 0 && (
              <tr>
                <td colSpan={6} className="text-center py-12 text-muted-foreground">
                  Nenhuma transação encontrada.
                </td>
              </tr>
            )}
            {paginated.map((tx) => (
              <tr key={tx.id} className="border-b border-border last:border-0 hover:bg-muted/20 transition-colors">
                <td className="px-4 py-3">
                  <div className="flex items-center gap-3">
                    <div className={`w-7 h-7 rounded-full flex items-center justify-center text-xs font-medium ${getCategoryColorClass(tx.category?.color)}`}>
                      {tx.category?.name?.[0]?.toUpperCase() ?? '?'}
                    </div>
                    <span className="font-medium">{tx.title}</span>
                  </div>
                </td>
                <td className="px-4 py-3 text-muted-foreground">{formatDate(tx.createdAt)}</td>
                <td className="px-4 py-3">
                  {tx.category ? (
                    <span className={`inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium ${getCategoryColorClass(tx.category.color)}`}>
                      {tx.category.name}
                    </span>
                  ) : (
                    <span className="text-muted-foreground text-xs">—</span>
                  )}
                </td>
                <td className="px-4 py-3">
                  <div className="flex items-center gap-1.5">
                    {tx.type === 'INCOME' ? (
                      <ArrowUpCircle className="h-4 w-4 text-green-500" />
                    ) : (
                      <ArrowDownCircle className="h-4 w-4 text-red-500" />
                    )}
                    <span className={`text-xs font-medium ${tx.type === 'INCOME' ? 'text-green-600' : 'text-red-600'}`}>
                      {tx.type === 'INCOME' ? 'Entrada' : 'Saída'}
                    </span>
                  </div>
                </td>
                <td className={`px-4 py-3 text-right font-semibold ${tx.type === 'INCOME' ? 'text-green-600' : 'text-red-600'}`}>
                  {tx.type === 'INCOME' ? '+' : '-'} {formatCurrency(tx.value)}
                </td>
                <td className="px-4 py-3">
                  <div className="flex items-center justify-end gap-1">
                    <Button variant="ghost" size="icon" className="h-7 w-7" onClick={() => handleEdit(tx)}>
                      <Pencil className="h-3.5 w-3.5" />
                    </Button>
                    <Button
                      variant="ghost"
                      size="icon"
                      className="h-7 w-7 text-destructive hover:text-destructive"
                      onClick={() => handleDelete(tx.id)}
                    >
                      <Trash2 className="h-3.5 w-3.5" />
                    </Button>
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
            <div className="flex items-center gap-1">
              <Button
                variant="outline"
                size="sm"
                className="h-7 w-7 p-0"
                disabled={page === 1}
                onClick={() => setPage(page - 1)}
              >
                ‹
              </Button>
              {Array.from({ length: Math.min(totalPages, 5) }, (_, i) => i + 1).map((p) => (
                <Button
                  key={p}
                  variant={page === p ? 'default' : 'outline'}
                  size="sm"
                  className="h-7 w-7 p-0 text-xs"
                  onClick={() => setPage(p)}
                >
                  {p}
                </Button>
              ))}
              <Button
                variant="outline"
                size="sm"
                className="h-7 w-7 p-0"
                disabled={page === totalPages}
                onClick={() => setPage(page + 1)}
              >
                ›
              </Button>
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
