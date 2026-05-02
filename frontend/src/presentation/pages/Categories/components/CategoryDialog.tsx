import { useEffect, useState } from 'react'
import { useMutation } from '@apollo/client/react'
import { toast } from 'sonner'
import { CREATE_CATEGORY, UPDATE_CATEGORY } from '@/domain/lib/graphql/mutations/category'
import type { Category } from '@/domain/types'
import {
  Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription,
} from '@/presentation/components/ui/dialog'
import { Button } from '@/presentation/components/ui/button'
import { Input } from '@/presentation/components/ui/input'
import { Label } from '@/presentation/components/ui/label'
import { COLOR_OPTIONS } from '@/presentation/utils/category-colors'
import { cn } from '@/presentation/utils/utils'
import {
  ShoppingCart, Utensils, Car, Home, Music, Film,
  Heart, Briefcase, Coffee, Book, Dumbbell, Smartphone,
  Plane, Gift, DollarSign, PiggyBank, TrendingUp, Zap,
} from 'lucide-react'

const ICONS = [
  { name: 'utensils', Icon: Utensils },
  { name: 'shopping-cart', Icon: ShoppingCart },
  { name: 'car', Icon: Car },
  { name: 'home', Icon: Home },
  { name: 'music', Icon: Music },
  { name: 'film', Icon: Film },
  { name: 'heart', Icon: Heart },
  { name: 'briefcase', Icon: Briefcase },
  { name: 'coffee', Icon: Coffee },
  { name: 'book', Icon: Book },
  { name: 'dumbbell', Icon: Dumbbell },
  { name: 'smartphone', Icon: Smartphone },
  { name: 'plane', Icon: Plane },
  { name: 'gift', Icon: Gift },
  { name: 'dollar-sign', Icon: DollarSign },
  { name: 'piggy-bank', Icon: PiggyBank },
  { name: 'trending-up', Icon: TrendingUp },
  { name: 'zap', Icon: Zap },
]

interface Props {
  open: boolean
  onOpenChange: (v: boolean) => void
  category?: Category | null
  onSaved?: () => void
}

export function CategoryDialog({ open, onOpenChange, category, onSaved }: Props) {
  const isEditing = !!category
  const [name, setName] = useState('')
  const [description, setDescription] = useState('')
  const [icon, setIcon] = useState('')
  const [color, setColor] = useState('')

  useEffect(() => {
    if (category) {
      setName(category.name)
      setDescription(category.description ?? '')
      setIcon(category.icon ?? '')
      setColor(category.color ?? '')
    } else {
      setName('')
      setDescription('')
      setIcon('')
      setColor('')
    }
  }, [category, open])

  const [createCategory, { loading: creating }] = useMutation(CREATE_CATEGORY, {
    onCompleted() {
      toast.success('Categoria criada!')
      onOpenChange(false)
      onSaved?.()
    },
    onError(err) { toast.error(err.message) },
  })

  const [updateCategory, { loading: updating }] = useMutation(UPDATE_CATEGORY, {
    onCompleted() {
      toast.success('Categoria atualizada!')
      onOpenChange(false)
      onSaved?.()
    },
    onError(err) { toast.error(err.message) },
  })

  const loading = creating || updating

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    const data = { name, description: description || null, icon: icon || null, color: color || null }
    if (isEditing && category) {
      updateCategory({ variables: { id: category.id, data } })
    } else {
      createCategory({ variables: { data } })
    }
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-md">
        <DialogHeader>
          <DialogTitle>{isEditing ? 'Editar categoria' : 'Nova categoria'}</DialogTitle>
          <DialogDescription>Organize suas transações com categorias</DialogDescription>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-1.5">
            <Label>Título</Label>
            <Input
              placeholder="Ex. Alimentação"
              value={name}
              onChange={(e) => setName(e.target.value)}
              required
            />
          </div>

          <div className="space-y-1.5">
            <Label>Descrição</Label>
            <Input
              placeholder="Descrição da categoria"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
            />
          </div>

          <div className="space-y-2">
            <Label className="text-muted-foreground text-xs">Ícone <span className="italic">(opcional)</span></Label>
            <div className="grid grid-cols-9 gap-1.5">
              {ICONS.map(({ name: n, Icon }) => (
                <button
                  key={n}
                  type="button"
                  onClick={() => setIcon(icon === n ? '' : n)}
                  className={cn(
                    'w-8 h-8 rounded-md flex items-center justify-center border transition-colors',
                    icon === n
                      ? 'border-primary bg-primary/10 text-primary'
                      : 'border-border hover:bg-muted text-muted-foreground'
                  )}
                >
                  <Icon className="h-4 w-4" />
                </button>
              ))}
            </div>
          </div>

          <div className="space-y-2">
            <Label>Cor</Label>
            <div className="flex gap-2">
              {COLOR_OPTIONS.map((c) => (
                <button
                  key={c.value}
                  type="button"
                  onClick={() => setColor(color === c.value ? '' : c.value)}
                  className={cn(
                    'w-8 h-8 rounded-full transition-transform',
                    c.bg,
                    color === c.value ? 'ring-2 ring-offset-2 ring-foreground scale-110' : 'hover:scale-105'
                  )}
                />
              ))}
            </div>
          </div>

          <div className="flex justify-end gap-3 pt-2">
            <Button type="button" variant="outline" onClick={() => onOpenChange(false)}>
              Cancelar
            </Button>
            <Button type="submit" disabled={loading}>
              {loading ? 'Salvando...' : 'Salvar'}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  )
}
