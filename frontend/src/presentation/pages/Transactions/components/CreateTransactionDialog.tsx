import { useState } from 'react'
import { useMutation } from '@apollo/client/react'
import { toast } from 'sonner'
import { CREATE_TRANSACTION } from '@/domain/lib/graphql/mutations/transaction'
import type { Category } from '@/domain/types'
import {
  Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription,
} from '@/presentation/components/ui/dialog'
import { Button } from '@/presentation/components/ui/button'
import { Input } from '@/presentation/components/ui/input'
import { Label } from '@/presentation/components/ui/label'
import {
  Select, SelectContent, SelectItem, SelectTrigger, SelectValue,
} from '@/presentation/components/ui/select'
import { CircleArrowDown, CircleArrowUp } from 'lucide-react'

interface Props {
  open: boolean
  onOpenChange: (v: boolean) => void
  categories: Category[]
  onCreated?: () => void
}

export function CreateTransactionDialog({ open, onOpenChange, categories, onCreated }: Props) {
  const [type, setType] = useState<'EXPENSE' | 'INCOME'>('EXPENSE')
  const [title, setTitle] = useState('')
  const [value, setValue] = useState('')
  const [date, setDate] = useState('')
  const [categoryId, setCategoryId] = useState('')

  const [createTransaction, { loading }] = useMutation(CREATE_TRANSACTION, {
    onCompleted() {
      toast.success('Transação criada com sucesso!')
      onOpenChange(false)
      reset()
      onCreated?.()
    },
    onError(err) {
      toast.error(err.message ?? 'Erro ao criar transação')
    },
  })

  function reset() {
    setType('EXPENSE')
    setTitle('')
    setValue('')
    setDate('')
    setCategoryId('')
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    createTransaction({
      variables: {
        data: {
          title,
          value: parseFloat(value),
          type,
          categoryId: categoryId || null,
        },
      },
    })
  }

  return (
    <Dialog open={open} onOpenChange={(v) => { onOpenChange(v); if (!v) reset() }}>
      <DialogContent className="max-w-md">
        <DialogHeader>
          <DialogTitle>Nova transação</DialogTitle>
          <DialogDescription>Registre sua despesa ou receita</DialogDescription>
        </DialogHeader>

        <div className="flex gap-2 mb-2 rounded-xl border-2 border-border p-1">
          <button
            type="button"
            onClick={() => setType('EXPENSE')}
            className={`flex-1 flex items-center justify-center gap-2 rounded-lg border-2 px-4 py-2.5 text-sm font-medium transition-colors
              ${type === 'EXPENSE'
                ? 'border-red-500 text-red-500 bg-red-50'
                : 'border-transparent text-muted-foreground hover:text-red-400'
              }`}
          >
            <CircleArrowDown className="h-4 w-4" /> Despesa
          </button>
          <button
            type="button"
            onClick={() => setType('INCOME')}
            className={`flex-1 flex items-center justify-center gap-2 rounded-lg border-2 px-4 py-2.5 text-sm font-medium transition-colors
              ${type === 'INCOME'
                ? 'border-green-600 text-green-600 bg-green-50'
                : 'border-transparent text-muted-foreground hover:text-green-500'
              }`}
          >
            <CircleArrowUp className="h-4 w-4" /> Receita
          </button>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-1.5">
            <Label>Descrição</Label>
            <Input
              className="h-12"
              placeholder="Ex. Almoço no restaurante"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              required
            />
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div className="space-y-1.5">
              <Label>Data</Label>
              <Input
                className="h-12"
                type="date"
                value={date}
                onChange={(e) => setDate(e.target.value)}
              />
            </div>
            <div className="space-y-1.5">
              <Label>Valor</Label>
              <div className="relative">
                <span className="absolute left-3 top-1/2 -translate-y-1/2 text-sm text-muted-foreground">R$</span>
                <Input
                  type="number"
                  step="0.01"
                  min="0"
                  placeholder="0,00"
                  value={value}
                  onChange={(e) => setValue(e.target.value)}
                  className="h-12 pl-9"
                  required
                />
              </div>
            </div>
          </div>

          <div className="space-y-1.5">
            <Label>Categoria</Label>
            <Select value={categoryId} onValueChange={setCategoryId}>
              <SelectTrigger className="h-12">
                <SelectValue placeholder="Selecione" />
              </SelectTrigger>
              <SelectContent>
                {categories.map((cat) => (
                  <SelectItem key={cat.id} value={cat.id}>{cat.name}</SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <Button type="submit" disabled={loading} className="w-full mt-2 h-12">
            {loading ? 'Salvando...' : 'Salvar'}
          </Button>
        </form>
      </DialogContent>
    </Dialog>
  )
}
