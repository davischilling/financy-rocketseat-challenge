export const COLOR_OPTIONS = [
  { value: 'green', label: 'Verde', bg: 'bg-green-500' },
  { value: 'blue', label: 'Azul', bg: 'bg-blue-500' },
  { value: 'purple', label: 'Roxo', bg: 'bg-purple-500' },
  { value: 'pink', label: 'Rosa', bg: 'bg-pink-500' },
  { value: 'red', label: 'Vermelho', bg: 'bg-red-500' },
  { value: 'orange', label: 'Laranja', bg: 'bg-orange-500' },
  { value: 'yellow', label: 'Amarelo', bg: 'bg-yellow-500' },
]

type ColorVariant = 'green' | 'blue' | 'purple' | 'pink' | 'red' | 'orange' | 'yellow'

export function getCategoryBadgeVariant(color?: string | null): ColorVariant {
  const map: Record<string, ColorVariant> = {
    green: 'green',
    blue: 'blue',
    purple: 'purple',
    pink: 'pink',
    red: 'red',
    orange: 'orange',
    yellow: 'yellow',
  }
  return map[color ?? ''] ?? 'green'
}

export function getCategoryColorClass(color?: string | null): string {
  const map: Record<string, string> = {
    green: 'bg-green-100 text-green-700',
    blue: 'bg-blue-100 text-blue-700',
    purple: 'bg-purple-100 text-purple-700',
    pink: 'bg-pink-100 text-pink-700',
    red: 'bg-red-100 text-red-700',
    orange: 'bg-orange-100 text-orange-700',
    yellow: 'bg-yellow-100 text-yellow-700',
  }
  return map[color ?? ''] ?? 'bg-gray-100 text-gray-700'
}
