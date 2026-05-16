import { NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'

export async function GET() {
  const [
    totalClientes,
    clientesPorFrecuencia,
    clientesPorPais,
    clientesPorMes,
    totalProductos,
    totalOportunidades,
    valorOportunidades,
  ] = await Promise.all([
    // Total clientes
    prisma.customer.count(),

    // Por frecuencia
    prisma.customer.groupBy({
      by: ['frequency'],
      _count: { frequency: true },
    }),

    // Por país (top 8)
    prisma.customer.groupBy({
      by: ['country'],
      _count: { country: true },
      orderBy: { _count: { country: 'desc' } },
      take: 8,
      where: { country: { not: null } },
    }),

    // Registros por mes (últimos 6 meses)
    prisma.$queryRaw<{ mes: string; total: number }[]>`
      SELECT 
        TO_CHAR("registrationDate", 'Mon') as mes,
        COUNT(*)::integer as total
      FROM public."Customers"
      WHERE "registrationDate" >= NOW() - INTERVAL '6 months'
      GROUP BY TO_CHAR("registrationDate", 'Mon'), DATE_TRUNC('month', "registrationDate")
      ORDER BY DATE_TRUNC('month', "registrationDate") ASC
    `,

    // Total productos
    prisma.product.count(),

    // Total oportunidades
    prisma.opportunity.count(),

    // Valor total oportunidades
    prisma.opportunity.aggregate({
      _sum: { estimatedValue: true },
    }),
  ])

  const freqMap = Object.fromEntries(
    clientesPorFrecuencia.map(f => [f.frequency, f._count.frequency])
  )

  const high = freqMap['HIGH'] ?? 0
  const medium = freqMap['MEDIUM'] ?? 0
  const low = freqMap['LOW'] ?? 0

  // Scoring aproximado basado en frecuencia
  // HIGH = Activo (100), MEDIUM = En riesgo (80), LOW = Perdido (50)
  const activos = high
  const enRiesgo = medium
  const perdidos = low
  const avgScore = totalClientes > 0
    ? Math.round((activos * 100 + enRiesgo * 80 + perdidos * 50) / totalClientes)
    : 0

  return NextResponse.json({
    totalClientes,
    highFrequency: high,
    avgScore,
    activos,
    enRiesgo,
    perdidos,
    totalProductos,
    totalOportunidades,
    valorOportunidades: Number(valorOportunidades._sum.estimatedValue ?? 0),
    clientesPorPais: clientesPorPais.map(p => ({
      pais: p.country ?? 'Desconocido',
      total: p._count.country,
    })),
    clientesPorMes: clientesPorMes.map(m => ({
      mes: m.mes,
      total: Number(m.total),
    })),
    segmentos: [
      { name: 'Activos', value: activos, color: '#10b981' },
      { name: 'En riesgo', value: enRiesgo, color: '#f59e0b' },
      { name: 'Perdidos', value: perdidos, color: '#ef4444' },
    ],
  })
}
