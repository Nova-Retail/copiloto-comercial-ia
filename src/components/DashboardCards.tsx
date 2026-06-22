import { Users, TrendingUp, Star, AlertTriangle, CheckCircle, XCircle, ShoppingCart } from 'lucide-react'

interface Props {
  total: number
  highFrequency: number
  avgScore: number
  activos: number
  enRiesgo: number
  perdidos: number
  totalOrdenes: number
}

export default function DashboardCards({ total, highFrequency, avgScore, activos, enRiesgo, perdidos, totalOrdenes }: Props) {
  const scoreColor =
    avgScore >= 70 ? 'bg-emerald-400' :
    avgScore >= 50 ? 'bg-amber-400' : 'bg-red-400'

  const cards = [
    {
      title: 'Total Clientes',
      value: total.toLocaleString(),
      icon: Users,
      color: 'text-indigo-600',
      bg: 'bg-indigo-50',
      sub: 'En cartera activa',
    },
    {
      title: 'Alta Frecuencia',
      value: highFrequency.toLocaleString(),
      icon: TrendingUp,
      color: 'text-emerald-600',
      bg: 'bg-emerald-50',
      sub: 'Compradores frecuentes',
    },
    {
      title: 'Score Promedio',
      value: `${avgScore}/100`,
      icon: Star,
      color: 'text-amber-600',
      bg: 'bg-amber-50',
      sub: 'Salud de cartera',
      progress: avgScore,
      progressColor: scoreColor,
    },
    {
      title: 'Clientes Activos',
      value: activos.toLocaleString(),
      icon: CheckCircle,
      color: 'text-blue-600',
      bg: 'bg-blue-50',
      sub: `${total > 0 ? Math.round((activos / total) * 100) : 0}% de la cartera`,
    },
  ]

  return (
    <div className="space-y-4">
      {/* KPI Cards */}
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
              {card.progress !== undefined && (
                <div className="mt-3">
                  <div className="bg-gray-100 rounded-full h-1.5">
                    <div
                      className={`${card.progressColor} h-1.5 rounded-full transition-all duration-500`}
                      style={{ width: `${card.progress}%` }}
                    />
                  </div>
                </div>
              )}
            </div>
          )
        })}
      </div>

      {/* Distribución por segmento + ordenes */}
      <div className="grid grid-cols-1 lg:grid-cols-4 gap-4">
        <div className="lg:col-span-3 bg-white rounded-xl border border-gray-200 p-5">
          <p className="text-sm font-semibold text-gray-700 mb-4">Distribución por segmento</p>
          <div className="grid grid-cols-3 gap-4">
            <div className="flex items-center gap-3">
              <div className="w-9 h-9 bg-emerald-50 rounded-lg flex items-center justify-center shrink-0">
                <CheckCircle size={18} className="text-emerald-600" />
              </div>
              <div>
                <p className="text-xl font-bold text-gray-900">{activos.toLocaleString()}</p>
                <p className="text-xs text-gray-500">Activos</p>
              </div>
              <div className="ml-auto">
                <span className="text-xs font-medium text-emerald-600 bg-emerald-50 px-2 py-0.5 rounded-full">
                  {total > 0 ? Math.round((activos / total) * 100) : 0}%
                </span>
              </div>
            </div>

            <div className="flex items-center gap-3">
              <div className="w-9 h-9 bg-amber-50 rounded-lg flex items-center justify-center shrink-0">
                <AlertTriangle size={18} className="text-amber-600" />
              </div>
              <div>
                <p className="text-xl font-bold text-gray-900">{enRiesgo.toLocaleString()}</p>
                <p className="text-xs text-gray-500">En riesgo</p>
              </div>
              <div className="ml-auto">
                <span className="text-xs font-medium text-amber-600 bg-amber-50 px-2 py-0.5 rounded-full">
                  {total > 0 ? Math.round((enRiesgo / total) * 100) : 0}%
                </span>
              </div>
            </div>

            <div className="flex items-center gap-3">
              <div className="w-9 h-9 bg-red-50 rounded-lg flex items-center justify-center shrink-0">
                <XCircle size={18} className="text-red-500" />
              </div>
              <div>
                <p className="text-xl font-bold text-gray-900">{perdidos.toLocaleString()}</p>
                <p className="text-xs text-gray-500">Perdidos</p>
              </div>
              <div className="ml-auto">
                <span className="text-xs font-medium text-red-500 bg-red-50 px-2 py-0.5 rounded-full">
                  {total > 0 ? Math.round((perdidos / total) * 100) : 0}%
                </span>
              </div>
            </div>
          </div>

          <div className="mt-4 flex rounded-full overflow-hidden h-2.5 gap-0.5">
            {activos > 0 && (
              <div className="bg-emerald-400 transition-all" style={{ width: `${(activos / total) * 100}%` }} />
            )}
            {enRiesgo > 0 && (
              <div className="bg-amber-400 transition-all" style={{ width: `${(enRiesgo / total) * 100}%` }} />
            )}
            {perdidos > 0 && (
              <div className="bg-red-400 transition-all" style={{ width: `${(perdidos / total) * 100}%` }} />
            )}
          </div>
        </div>

        {/* KPI Ordenes */}
        <div className="bg-gradient-to-br from-indigo-600 to-violet-600 rounded-xl p-5 text-white flex flex-col justify-between">
          <div className="w-10 h-10 bg-white/15 rounded-lg flex items-center justify-center mb-4">
            <ShoppingCart size={20} className="text-white" />
          </div>
          <div>
            <p className="text-3xl font-bold">{totalOrdenes.toLocaleString()}</p>
            <p className="text-sm font-medium text-indigo-200 mt-0.5">Órdenes procesadas</p>
            <p className="text-xs text-indigo-300 mt-1">Historial de compras</p>
          </div>
        </div>
      </div>
    </div>
  )
}
