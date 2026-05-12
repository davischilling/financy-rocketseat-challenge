import { useState } from 'react'
import { useQuery, useMutation } from '@apollo/client/react'
import { toast } from 'sonner'
import { LIST_CATEGORIES } from '@/domain/lib/graphql/queries/category'
import { LIST_TRANSACTIONS } from '@/domain/lib/graphql/queries/transaction'
import { GET_STATS } from '@/domain/lib/graphql/queries/stats'
import { DELETE_CATEGORY } from '@/domain/lib/graphql/mutations/category'
import type { Category, Transaction, Stats } from '@/domain/types'
import { Button } from '@/presentation/components/ui/button'
import {
  Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription,
} from '@/presentation/components/ui/dialog'
import { CategoryDialog } from './components/CategoryDialog'
import { Plus, Trash, SquarePen, Tag, ArrowLeftRight } from 'lucide-react'
import { getCategoryColorClass } from '@/presentation/utils/category-colors'
import { cn } from '@/presentation/utils/utils'
import {
  Briefcase, Car, Heart, PiggyBank, ShoppingCart, Ticket, Gift, Utensils,
  Coffee, Home, Wrench, Dumbbell, Book, ShoppingBag, Monitor, Receipt,
} from 'lucide-react'

const ICON_MAP: Record<string, React.ComponentType<{ className?: string }>> = {
  'briefcase':     Briefcase,
  'car':           Car,
  'heart':         Heart,
  'piggy-bank':    PiggyBank,
  'shopping-cart': ShoppingCart,
  'ticket':        Ticket,
  'gift':          Gift,
  'utensils':      Utensils,
  'coffee':        Coffee,
  'home':          Home,
  'wrench':        Wrench,
  'dumbbell':      Dumbbell,
  'book':          Book,
  'shopping-bag':  ShoppingBag,
  'monitor':       Monitor,
  'receipt':       Receipt,
}

export function CategoryIcon({ icon, color, className }: { icon?: string | null; color?: string | null; className?: string }) {
  const IconComponent = icon ? ICON_MAP[icon] : null
  return (
    <div className={cn('w-10 h-10 rounded-lg flex items-center justify-center', getCategoryColorClass(color), className)}>
      {IconComponent ? <IconComponent className="h-5 w-5" /> : <Tag className="h-5 w-5" />}
    </div>
  )
}

export function CategoriesPage() {
  const [dialogOpen, setDialogOpen] = useState(false)
  const [selected, setSelected] = useState<Category | null>(null)
  const [deleteTarget, setDeleteTarget] = useState<string | null>(null)

  const { data: catData, loading, refetch } = useQuery<{ listCategories: Category[] }>(LIST_CATEGORIES)
  const { data: txData } = useQuery<{ listTransactions: Transaction[] }>(LIST_TRANSACTIONS)
  const { data: statsData } = useQuery<{ stats: Stats }>(GET_STATS, { fetchPolicy: 'network-only' })

  const [deleteCategory] = useMutation(DELETE_CATEGORY, {
    onCompleted() { toast.success('Categoria excluída'); refetch() },
    onError(err) { toast.error(err.message) },
  })

  const categories = catData?.listCategories ?? []
  const transactions = txData?.listTransactions ?? []
  const stats = statsData?.stats

  const handleDelete = (id: string) => setDeleteTarget(id)

  const handleConfirmDelete = () => {
    if (deleteTarget) deleteCategory({ variables: { id: deleteTarget } })
    setDeleteTarget(null)
  }

  const handleEdit = (cat: Category) => {
    setSelected(cat)
    setDialogOpen(true)
  }

  const handleCreate = () => {
    setSelected(null)
    setDialogOpen(true)
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold">Categorias</h1>
          <p className="text-sm text-muted-foreground">Organize suas transações por categorias</p>
        </div>
        <Button onClick={handleCreate} className="gap-2">
          <Plus className="h-4 w-4" /> Nova categoria
        </Button>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="bg-white rounded-xl border border-border p-4 flex items-center gap-4">
          <Tag className="h-8 w-8 text-primary" />
          <div className="gap-2">
            <p className="text-2xl font-bold">{stats?.totalCategoriesCount ?? categories.length}</p>
            <p className="text-xs text-muted-foreground uppercase tracking-wide">Total de categorias</p>
          </div>
        </div>
        <div className="bg-white rounded-xl border border-border p-4 flex items-center gap-4">
          <ArrowLeftRight className="h-8 w-8 text-blue-600" />
          <div className="gap-2">
            <p className="text-2xl font-bold">{stats?.totalTransactionsCount ?? transactions.length}</p>
            <p className="text-xs text-muted-foreground uppercase tracking-wide">Total de transações</p>
          </div>
        </div>
        <div className="bg-white rounded-xl border border-border p-4 flex items-center gap-4">
          {stats?.mostUsedCategory && <CategoryIcon icon={stats.mostUsedCategory.icon} color={stats.mostUsedCategory.color} />}
          <div className="gap-2">
            <p className="text-xl font-bold">{stats?.mostUsedCategory?.name ?? '—'}</p>
            <p className="text-xs text-muted-foreground uppercase tracking-wide">Categoria mais usada</p>
          </div>
        </div>
      </div>

      {/* Categories grid */}
      {loading && (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          {Array.from({ length: 8 }).map((_, i) => (
            <div key={i} className="h-32 rounded-xl bg-muted animate-pulse" />
          ))}
        </div>
      )}

      {!loading && categories.length === 0 && (
        <div className="text-center py-16 text-muted-foreground">
          <Tag className="h-12 w-12 mx-auto mb-3 opacity-30" />
          <p>Nenhuma categoria criada ainda.</p>
        </div>
      )}

      {!loading && categories.length > 0 && (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          {categories.map((cat) => {
            const txCount = transactions.filter((t) => t.categoryId === cat.id).length
            return (
              <div
                key={cat.id}
                className="bg-white rounded-xl border border-border p-6 space-y-3 relative group"
              >
                <div className="flex flex-row items-center justify-between">
                <CategoryIcon icon={cat.icon} color={cat.color} />
                  <div className="flex flex-row items-center justify-center gap-2">
                    <button
                      onClick={() => handleDelete(cat.id)}
                      className="w-8 h-8 rounded flex items-center justify-center text-muted-foreground hover:text-destructive hover:bg-destructive/10 transition-colors border border-gray-300"
                    >
                      <Trash className="h-4 w-4 text-danger" />
                    </button>
                    <button
                      onClick={() => handleEdit(cat)}
                      className="w-8 h-8 rounded flex items-center justify-center text-muted-foreground hover:text-primary hover:bg-primary/10 transition-colors border border-gray-300"
                    >
                      <SquarePen className="h-4 w-4" />
                    </button>
                  </div>
                </div>

                <div>
                  <p className="font-semibold text-md">{cat.name}</p>
                  {cat.description && (
                    <p className="text-[14px] text-muted-foreground mt-1 mb-8 line-clamp-2">{cat.description}</p>
                  )}
                </div>

                <div className="flex flex-row items-center justify-between">
                  <span className={cn(
                    'inline-flex items-center px-2 py-1 rounded-full text-xs font-medium',
                    getCategoryColorClass(cat.color)
                  )}>
                    {cat.name}
                  </span>
                  <span className="text-[14px] text-muted-foreground ml-2">{txCount} {txCount === 1 ? 'item' : 'itens'}</span>
                </div>
              </div>
            )
          })}
        </div>
      )}

      <CategoryDialog
        open={dialogOpen}
        onOpenChange={setDialogOpen}
        category={selected}
        onSaved={() => refetch()}
      />

      <Dialog open={deleteTarget !== null} onOpenChange={(open) => { if (!open) setDeleteTarget(null) }}>
        <DialogContent className="max-w-sm">
          <DialogHeader>
            <DialogTitle>Excluir categoria</DialogTitle>
            <DialogDescription>
              Deseja excluir esta categoria? As transações vinculadas perderão a categoria.
            </DialogDescription>
          </DialogHeader>
          <div className="flex gap-3 justify-end mt-2">
            <Button variant="outline" onClick={() => setDeleteTarget(null)}>Não</Button>
            <Button variant="destructive" onClick={handleConfirmDelete}>Sim</Button>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  )
}
