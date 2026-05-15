import { getAllClients } from '@/services/clientsService'
import { calculateScore } from '@/lib/scoring'
import DashboardCards from '@/components/DashboardCards'
import Link from 'next/link'
import { ArrowRight } from 'lucide-react'

export default async function DashboardPage() {
  const { clients } = await getAllClients()
  const scores = clients.map((c) => calculateScore(c.frequency, c.lastPurchase))

  const avgScore =
    clients.length > 0
      ? Math.round(scores.reduce((sum, s) => sum + s.score, 0) / clients.length)
      : 0

  const highFrequency = clients.filter((c) => c.frequency === 'HIGH').length
  const activos = scores.filter((s) => s.score >= 80).length
  const enRiesgo = scores.filter((s) => s.score >= 60 && s.score < 80).length
  const perdidos = scores.filter((s) => s.score < 60).length

  return (
    <div className="p-8 max-w-7xl mx-auto">
      <div className="mb-8">
        <h1 className="text-2xl font-bold text-gray-900">Dashboard</h1>
        <p className="text-gray-500 mt-1">Visión general de tu cartera de clientes</p>
      </div>

      <DashboardCards
        total={clients.length}
        highFrequency={highFrequency}
        avgScore={avgScore}
        activos={activos}
        enRiesgo={enRiesgo}
        perdidos={perdidos}
      />

      <div className="mt-6 bg-white rounded-xl border border-gray-200 overflow-hidden">
        <div className="px-6 py-4 border-b border-gray-100 flex items-center justify-between">
          <h2 className="text-base font-semibold text-gray-900">Clientes recientes</h2>
          <Link
            href="/clients"
            className="flex items-center gap-1 text-sm text-indigo-600 hover:text-indigo-700 font-medium"
          >
            Ver todos <ArrowRight size={14} />
          </Link>
        </div>
        <div className="divide-y divide-gray-50">
          {clients.slice(0, 5).map((client) => {
            const { score, label, bgColor, color } = calculateScore(
              client.frequency,
              client.lastPurchase
            )
            return (
              <div
                key={client.id}
                className="flex items-center justify-between px-6 py-3.5 hover:bg-gray-50 transition-colors"
              >
                <div>
                  <p className="text-sm font-medium text-gray-900">{client.name}</p>
                  <p className="text-xs text-gray-400 mt-0.5">{client.interest}</p>
                </div>
                <span className={`text-xs font-semibold px-2.5 py-1 rounded-full border ${bgColor} ${color}`}>
                  {label} · {score}
                </span>
              </div>
            )
          })}
        </div>
      </div>
    </div>
  )
}
