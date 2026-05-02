export const COLOR_OPTIONS = [
  { value: 'green', label: 'Verde', bg: 'bg-green-500', hex: '#22c55e' },
  { value: 'blue', label: 'Azul', bg: 'bg-blue-500', hex: '#3b82f6' },
  { value: 'purple', label: 'Roxo', bg: 'bg-purple-500', hex: '#a855f7' },
  { value: 'red', label: 'Vermelho', bg: 'bg-red-500', hex: '#ef4444' },
  { value: 'orange', label: 'Laranja', bg: 'bg-orange-500', hex: '#f97316' },
  { value: 'yellow', label: 'Amarelo', bg: 'bg-yellow-500', hex: '#eab308' },
]

type BadgeVariant = 'green' | 'blue' | 'purple' | 'red' | 'orange' | 'yellow' | 'teal' | 'pink' | 'secondary'

export function getCategoryBadgeVariant(color?: string | null): BadgeVariant {
  const map: Record<string, BadgeVariant> = {
    green: 'green',
    blue: 'blue',
    purple: 'purple',
    red: 'red',
    orange: 'orange',
    yellow: 'yellow',
    teal: 'teal',
    pink: 'pink',
  }
  return map[color ?? ''] ?? 'secondary'
}

export function getCategoryColorClass(color?: string | null): string {
  const map: Record<string, string> = {
    green: 'bg-green-100 text-green-700',
    blue: 'bg-blue-100 text-blue-700',
    purple: 'bg-purple-100 text-purple-700',
    red: 'bg-red-100 text-red-700',
    orange: 'bg-orange-100 text-orange-700',
    yellow: 'bg-yellow-100 text-yellow-700',
    teal: 'bg-teal-100 text-teal-700',
    pink: 'bg-pink-100 text-pink-700',
  }
  return map[color ?? ''] ?? 'bg-gray-100 text-gray-700'
}
