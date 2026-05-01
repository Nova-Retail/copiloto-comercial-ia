import { Users, TrendingUp, Star, Award } from 'lucide-react'

interface Props {
  total: number
  highFrequency: number
  avgScore: number
  premium: number
}

export default function DashboardCards({ total, highFrequency, avgScore, premium }: Props) {
  const cards = [
    {
      title: 'Total Clientes',
      value: total,
      icon: Users,
      color: 'text-blue-600',
      bg: 'bg-blue-50',
      sub: 'En cartera activa',
    },
    {
      title: 'Alta Frecuencia',
      value: highFrequency,
      icon: TrendingUp,
      color: 'text-emerald-600',
      bg: 'bg-emerald-50',
      sub: 'Compradores activos',
    },
    {
      title: 'Score Promedio',
      value: `${avgScore}/100`,
      icon: Star,
      color: 'text-amber-600',
      bg: 'bg-amber-50',
      sub: 'Salud de cartera',
    },
    {
      title: 'Clientes Premium',
      value: premium,
      icon: Award,
      color: 'text-indigo-600',
      bg: 'bg-indigo-50',
      sub: 'Score ≥ 80',
    },
  ]

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
      {cards.map((card) => {
        const Icon = card.icon
        return (
          <div key={card.title} className="bg-white rounded-xl border border-gray-200 p-5 hover:shadow-sm transition-shadow">
            <div className="flex items-center justify-between mb-4">
              <div className={`w-10 h-10 ${card.bg} rounded-lg flex items-center justify-center`}>
                <Icon size={20} className={card.color} />
              </div>
            </div>
            <p className="text-2xl font-bold text-gray-900">{card.value}</p>
            <p className="text-sm font-medium text-gray-600 mt-0.5">{card.title}</p>
            <p className="text-xs text-gray-400 mt-1">{card.sub}</p>
          </div>
        )
      })}
    </div>
  )
}
