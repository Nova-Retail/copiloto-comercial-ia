'use client'

import {
  PieChart, Pie, Cell, Tooltip, ResponsiveContainer,
  BarChart, Bar, XAxis, YAxis, CartesianGrid,
  LineChart, Line, Legend,
} from 'recharts'

interface Props {
  segmentos: { name: string; value: number; color: string }[]
  clientesPorPais: { pais: string; total: number }[]
  clientesPorMes: { mes: string; total: number }[]
  totalClientes: number
}

const COLORS = {
  Activos:   '#10b981',
  'En riesgo': '#f59e0b',
  Perdidos:  '#ef4444',
}

function CustomTooltip({ active, payload }: any) {
  if (active && payload && payload.length) {
    return (
      <div className="bg-white border border-gray-200 rounded-lg shadow-md px-3 py-2 text-xs">
        <p className="font-semibold text-gray-800">{payload[0].name}</p>
        <p className="text-gray-500">{payload[0].value.toLocaleString()} clientes</p>
      </div>
    )
  }
  return null
}

export default function DashboardCharts({ segmentos, clientesPorPais, clientesPorMes, totalClientes }: Props) {
  return (
    <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mt-6">

      {/* Dona — Segmentación */}
      <div className="bg-white rounded-xl border border-gray-200 p-6">
        <h3 className="text-sm font-semibold text-gray-700 mb-4">Segmentación de clientes</h3>
        <div className="relative">
          <ResponsiveContainer width="100%" height={200}>
            <PieChart>
              <Pie
                data={segmentos}
                cx="50%"
                cy="50%"
                innerRadius={60}
                outerRadius={85}
                paddingAngle={3}
                dataKey="value"
              >
                {segmentos.map((entry, index) => (
                  <Cell key={index} fill={entry.color} strokeWidth={0} />
                ))}
              </Pie>
              <Tooltip content={<CustomTooltip />} />
            </PieChart>
          </ResponsiveContainer>
          {/* Label central */}
          <div className="absolute inset-0 flex flex-col items-center justify-center pointer-events-none">
            <p className="text-2xl font-bold text-gray-900">{totalClientes.toLocaleString()}</p>
            <p className="text-xs text-gray-400">clientes</p>
          </div>
        </div>
        <div className="flex flex-col gap-2 mt-3">
          {segmentos.map((s) => (
            <div key={s.name} className="flex items-center justify-between text-xs">
              <div className="flex items-center gap-2">
                <div className="w-2.5 h-2.5 rounded-full" style={{ backgroundColor: s.color }} />
                <span className="text-gray-600">{s.name}</span>
              </div>
              <div className="flex items-center gap-2">
                <span className="font-semibold text-gray-800">{s.value.toLocaleString()}</span>
                <span className="text-gray-400">
                  {totalClientes > 0 ? Math.round((s.value / totalClientes) * 100) : 0}%
                </span>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Barras — Clientes por país */}
      <div className="bg-white rounded-xl border border-gray-200 p-6 lg:col-span-2">
        <h3 className="text-sm font-semibold text-gray-700 mb-4">Clientes por país</h3>
        <ResponsiveContainer width="100%" height={240}>
          <BarChart data={clientesPorPais} margin={{ top: 0, right: 10, left: -20, bottom: 0 }}>
            <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" />
            <XAxis dataKey="pais" tick={{ fontSize: 11, fill: '#94a3b8' }} axisLine={false} tickLine={false} />
            <YAxis tick={{ fontSize: 11, fill: '#94a3b8' }} axisLine={false} tickLine={false} />
            <Tooltip
              formatter={(value: number) => [value.toLocaleString(), 'Clientes']}
              contentStyle={{ borderRadius: '8px', border: '1px solid #e2e8f0', fontSize: '12px' }}
            />
            <Bar dataKey="total" fill="#6366f1" radius={[6, 6, 0, 0]} maxBarSize={40} />
          </BarChart>
        </ResponsiveContainer>
      </div>

      {/* Línea — Tendencia mensual */}
      {clientesPorMes.length > 0 && (
        <div className="bg-white rounded-xl border border-gray-200 p-6 lg:col-span-3">
          <h3 className="text-sm font-semibold text-gray-700 mb-4">Nuevos clientes por mes</h3>
          <ResponsiveContainer width="100%" height={200}>
            <LineChart data={clientesPorMes} margin={{ top: 4, right: 10, left: -20, bottom: 0 }}>
              <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" />
              <XAxis dataKey="mes" tick={{ fontSize: 11, fill: '#94a3b8' }} axisLine={false} tickLine={false} />
              <YAxis tick={{ fontSize: 11, fill: '#94a3b8' }} axisLine={false} tickLine={false} />
              <Tooltip
                formatter={(value: number) => [value.toLocaleString(), 'Clientes']}
                contentStyle={{ borderRadius: '8px', border: '1px solid #e2e8f0', fontSize: '12px' }}
              />
              <Line
                type="monotone"
                dataKey="total"
                stroke="#6366f1"
                strokeWidth={2.5}
                dot={{ fill: '#6366f1', r: 4, strokeWidth: 0 }}
                activeDot={{ r: 6, fill: '#4f46e5' }}
                name="Nuevos clientes"
              />
            </LineChart>
          </ResponsiveContainer>
        </div>
      )}
    </div>
  )
}
