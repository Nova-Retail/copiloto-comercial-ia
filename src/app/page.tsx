import { prisma } from '@/lib/prisma'
import { calculateScore } from '@/lib/scoring'
import DashboardCards from '@/components/DashboardCards'
import DashboardCharts from '@/components/DashboardCharts'
import Link from 'next/link'
import { ArrowRight } from 'lucide-react'

async function getStats() {
  const [
    totalClientes,
    clientesPorFrecuencia,
    clientesPorPais,
    clientesPorMes,
    totalProductos,
    totalOportunidades,
    recentClients,
  ] = await Promise.all([
    prisma.customer.count(),
    prisma.customer.groupBy({
      by: ['frequency'],
      _count: { frequency: true },
    }),
    prisma.customer.groupBy({
      by: ['country'],
      _count: { country: true },
      orderBy: { _count: { country: 'desc' } },
      take: 8,
      where: { country: { not: null } },
    }),
    prisma.$queryRaw<{ mes: string; total: number }[]>`
      SELECT 
        TO_CHAR("registrationDate", 'Mon') as mes,
        COUNT(*)::integer as total
      FROM public."Customers"
      WHERE "registrationDate" >= NOW() - INTERVAL '6 months'
      GROUP BY TO_CHAR("registrationDate", 'Mon'), DATE_TRUNC('month', "registrationDate")
      ORDER BY DATE_TRUNC('month', "registrationDate") ASC
    `,
    prisma.product.count(),
    prisma.opportunity.count(),
    prisma.customer.findMany({
      orderBy: { registrationDate: 'desc' },
      take: 5,
    }),
  ])

  const freqMap = Object.fromEntries(
    clientesPorFrecuencia.map((f: { frequency: string; _count: { frequency: number } }) => [f.frequency, f._count.frequency])
  )

  const high = freqMap['HIGH'] ?? 0
  const medium = freqMap['MEDIUM'] ?? 0
  const low = freqMap['LOW'] ?? 0

  const avgScore = totalClientes > 0
    ? Math.round((high * 100 + medium * 80 + low * 50) / totalClientes)
    : 0

  return {
    totalClientes,
    highFrequency: high,
    avgScore,
    activos: high,
    enRiesgo: medium,
    perdidos: low,
    totalProductos,
    totalOportunidades,
    clientesPorPais: clientesPorPais.map(p => ({
      pais: p.country ?? 'Desconocido',
      total: p._count.country,
    })),
    clientesPorMes: clientesPorMes.map(m => ({
      mes: m.mes,
      total: Number(m.total),
    })),
    segmentos: [
      { name: 'Activos', value: high, color: '#10b981' },
      { name: 'En riesgo', value: medium, color: '#f59e0b' },
      { name: 'Perdidos', value: low, color: '#ef4444' },
    ],
    recentClients,
  }
}

export default async function DashboardPage() {
  const stats = await getStats()

  return (
    <div className="p-8 max-w-7xl mx-auto">
      <div className="mb-8 flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Dashboard</h1>
          <p className="text-gray-500 mt-1">Visión general de tu cartera de clientes</p>
        </div>
        <div className="flex items-center gap-4 text-sm text-gray-500">
          <span>{stats.totalProductos} productos</span>
          <span>·</span>
          <span>{stats.totalOportunidades} oportunidades</span>
        </div>
      </div>

      {/* KPI Cards */}
      <DashboardCards
        total={stats.totalClientes}
        highFrequency={stats.highFrequency}
        avgScore={stats.avgScore}
        activos={stats.activos}
        enRiesgo={stats.enRiesgo}
        perdidos={stats.perdidos}
      />

      {/* Gráficas */}
      <DashboardCharts
        segmentos={stats.segmentos}
        clientesPorPais={stats.clientesPorPais}
        clientesPorMes={stats.clientesPorMes}
      />

      {/* Clientes recientes */}
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
          {stats.recentClients.map((client) => {
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
                  <p className="text-sm font-medium text-gray-900">{client.fullName}</p>
                  <p className="text-xs text-gray-400 mt-0.5">
                    {client.city && client.country
                      ? `${client.city}, ${client.country}`
                      : client.interest || '—'}
                  </p>
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
