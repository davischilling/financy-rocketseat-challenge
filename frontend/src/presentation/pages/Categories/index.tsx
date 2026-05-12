import { useState } from 'react'
import { useQuery, useMutation } from '@apollo/client/react'
import { toast } from 'sonner'
import { LIST_CATEGORIES } from '@/domain/lib/graphql/queries/category'
import { LIST_TRANSACTIONS } from '@/domain/lib/graphql/queries/transaction'
import { GET_STATS } from '@/domain/lib/graphql/queries/stats'
import { DELETE_CATEGORY } from '@/domain/lib/graphql/mutations/category'
import type { Category, Transaction, Stats } from '@/domain/types'
import { Button } from '@/presentation/components/ui/button'
import { CategoryDialog } from './components/CategoryDialog'
import { Plus, Trash2, Pencil, Tag, ArrowLeftRight } from 'lucide-react'
import { getCategoryColorClass } from '@/presentation/utils/category-colors'
import { cn } from '@/presentation/utils/utils'
import {
  ShoppingCart, Utensils, Car, Home, Music, Film,
  Heart, Briefcase, Coffee, Book, Dumbbell, Smartphone,
  Plane, Gift, DollarSign, PiggyBank, TrendingUp, Zap,
} from 'lucide-react'

const ICON_MAP: Record<string, React.ComponentType<{ className?: string }>> = {
  'utensils': Utensils,
  'shopping-cart': ShoppingCart,
  'car': Car,
  'home': Home,
  'music': Music,
  'film': Film,
  'heart': Heart,
  'briefcase': Briefcase,
  'coffee': Coffee,
  'book': Book,
  'dumbbell': Dumbbell,
  'smartphone': Smartphone,
  'plane': Plane,
  'gift': Gift,
  'dollar-sign': DollarSign,
  'piggy-bank': PiggyBank,
  'trending-up': TrendingUp,
  'zap': Zap,
}

function CategoryIcon({ icon, color, className }: { icon?: string | null; color?: string | null; className?: string }) {
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

  const { data: catData, loading, refetch } = useQuery<{ listCategories: Category[] }>(LIST_CATEGORIES)
  const { data: txData } = useQuery<{ listTransactions: Transaction[] }>(LIST_TRANSACTIONS)
  const { data: statsData } = useQuery<{ stats: Stats }>(GET_STATS)

  const [deleteCategory] = useMutation(DELETE_CATEGORY, {
    onCompleted() { toast.success('Categoria excluída'); refetch() },
    onError(err) { toast.error(err.message) },
  })

  const categories = catData?.listCategories ?? []
  const transactions = txData?.listTransactions ?? []
  const stats = statsData?.stats

  const handleDelete = (id: string) => {
    if (confirm('Deseja excluir esta categoria? As transações vinculadas perderão a categoria.')) {
      deleteCategory({ variables: { id } })
    }
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
          <div className="w-10 h-10 rounded-lg bg-primary/10 flex items-center justify-center">
            <Tag className="h-5 w-5 text-primary" />
          </div>
          <div>
            <p className="text-2xl font-bold">{stats?.totalCategoriesCount ?? categories.length}</p>
            <p className="text-xs text-muted-foreground uppercase tracking-wide">Total de categorias</p>
          </div>
        </div>
        <div className="bg-white rounded-xl border border-border p-4 flex items-center gap-4">
          <div className="w-10 h-10 rounded-lg bg-blue-100 flex items-center justify-center">
            <ArrowLeftRight className="h-5 w-5 text-blue-600" />
          </div>
          <div>
            <p className="text-2xl font-bold">{stats?.totalTransactionsCount ?? transactions.length}</p>
            <p className="text-xs text-muted-foreground uppercase tracking-wide">Total de transações</p>
          </div>
        </div>
        <div className="bg-white rounded-xl border border-border p-4 flex items-center gap-4">
          {stats?.mostUsedCategory && <CategoryIcon icon={stats.mostUsedCategory.icon} color={stats.mostUsedCategory.color} />}
          <div>
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
          <Button variant="outline" className="mt-4 gap-2" onClick={handleCreate}>
            <Plus className="h-4 w-4" /> Criar categoria
          </Button>
        </div>
      )}

      {!loading && categories.length > 0 && (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          {categories.map((cat) => {
            const txCount = transactions.filter((t) => t.categoryId === cat.id).length
            return (
              <div
                key={cat.id}
                className="bg-white rounded-xl border border-border p-4 space-y-3 relative group"
              >
                <div className="absolute top-3 right-3 flex gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                  <button
                    onClick={() => handleDelete(cat.id)}
                    className="w-6 h-6 rounded flex items-center justify-center text-muted-foreground hover:text-destructive hover:bg-destructive/10 transition-colors"
                  >
                    <Trash2 className="h-3.5 w-3.5" />
                  </button>
                  <button
                    onClick={() => handleEdit(cat)}
                    className="w-6 h-6 rounded flex items-center justify-center text-muted-foreground hover:text-primary hover:bg-primary/10 transition-colors"
                  >
                    <Pencil className="h-3.5 w-3.5" />
                  </button>
                </div>

                <CategoryIcon icon={cat.icon} color={cat.color} />

                <div>
                  <p className="font-semibold text-sm">{cat.name}</p>
                  {cat.description && (
                    <p className="text-xs text-muted-foreground mt-0.5 line-clamp-2">{cat.description}</p>
                  )}
                </div>

                <div>
                  <span className={cn(
                    'inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium',
                    getCategoryColorClass(cat.color)
                  )}>
                    {cat.name}
                  </span>
                  <span className="text-xs text-muted-foreground ml-2">{txCount} {txCount === 1 ? 'item' : 'itens'}</span>
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
    </div>
  )
}
