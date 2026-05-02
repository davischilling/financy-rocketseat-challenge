import { useEffect, useState } from 'react'
import { useMutation } from '@apollo/client/react'
import { toast } from 'sonner'
import { UPDATE_TRANSACTION } from '@/domain/lib/graphql/mutations/transaction'
import type { Transaction, Category } from '@/domain/types'
import {
  Dialog, DialogContent, DialogHeader, DialogTitle,
} from '@/presentation/components/ui/dialog'
import { Button } from '@/presentation/components/ui/button'
import { Input } from '@/presentation/components/ui/input'
import { Label } from '@/presentation/components/ui/label'
import {
  Select, SelectContent, SelectItem, SelectTrigger, SelectValue,
} from '@/presentation/components/ui/select'

interface Props {
  open: boolean
  onOpenChange: (v: boolean) => void
  transaction: Transaction | null
  categories: Category[]
  onUpdated?: () => void
}

export function EditTransactionDialog({ open, onOpenChange, transaction, categories, onUpdated }: Props) {
  const [type, setType] = useState<'EXPENSE' | 'INCOME'>('EXPENSE')
  const [title, setTitle] = useState('')
  const [value, setValue] = useState('')
  const [categoryId, setCategoryId] = useState('')

  useEffect(() => {
    if (transaction) {
      setType(transaction.type as 'EXPENSE' | 'INCOME')
      setTitle(transaction.title)
      setValue(String(transaction.value))
      setCategoryId(transaction.categoryId ?? '')
    }
  }, [transaction])

  const [updateTransaction, { loading }] = useMutation(UPDATE_TRANSACTION, {
    onCompleted() {
      toast.success('Transação atualizada!')
      onOpenChange(false)
      onUpdated?.()
    },
    onError(err) {
      toast.error(err.message ?? 'Erro ao atualizar transação')
    },
  })

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    if (!transaction) return
    updateTransaction({
      variables: {
        id: transaction.id,
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
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-md">
        <DialogHeader>
          <DialogTitle>Editar transação</DialogTitle>
        </DialogHeader>

        <div className="flex gap-2 mb-2">
          <Button
            type="button"
            variant={type === 'EXPENSE' ? 'default' : 'outline'}
            className="flex-1"
            onClick={() => setType('EXPENSE')}
          >
            Despesa
          </Button>
          <Button
            type="button"
            variant={type === 'INCOME' ? 'default' : 'outline'}
            className={`flex-1 ${type === 'INCOME' ? 'bg-green-600 hover:bg-green-700' : ''}`}
            onClick={() => setType('INCOME')}
          >
            Receita
          </Button>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-1.5">
            <Label>Descrição</Label>
            <Input value={title} onChange={(e) => setTitle(e.target.value)} required />
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div className="space-y-1.5">
              <Label>Valor</Label>
              <div className="relative">
                <span className="absolute left-3 top-1/2 -translate-y-1/2 text-sm text-muted-foreground">R$</span>
                <Input
                  type="number"
                  step="0.01"
                  min="0"
                  value={value}
                  onChange={(e) => setValue(e.target.value)}
                  className="pl-9"
                  required
                />
              </div>
            </div>
            <div className="space-y-1.5">
              <Label>Categoria</Label>
              <Select value={categoryId} onValueChange={setCategoryId}>
                <SelectTrigger>
                  <SelectValue placeholder="Selecione" />
                </SelectTrigger>
                <SelectContent>
                  {categories.map((cat) => (
                    <SelectItem key={cat.id} value={cat.id}>{cat.name}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
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
