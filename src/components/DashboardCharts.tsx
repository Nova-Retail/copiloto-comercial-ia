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
}

export default function DashboardCharts({ segmentos, clientesPorPais, clientesPorMes }: Props) {
  return (
    <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mt-6">

      {/* Gráfica de dona — Segmentación */}
      <div className="bg-white rounded-xl border border-gray-200 p-6">
        <h3 className="text-sm font-semibold text-gray-700 mb-4">Segmentación de clientes</h3>
        <ResponsiveContainer width="100%" height={200}>
          <PieChart>
            <Pie
              data={segmentos}
              cx="50%"
              cy="50%"
              innerRadius={55}
              outerRadius={80}
              paddingAngle={3}
              dataKey="value"
            >
              {segmentos.map((entry, index) => (
                <Cell key={index} fill={entry.color} />
              ))}
            </Pie>
            <Tooltip formatter={(value: number) => [value.toLocaleString(), 'Clientes']} />
          </PieChart>
        </ResponsiveContainer>
        <div className="flex flex-col gap-2 mt-2">
          {segmentos.map((s) => (
            <div key={s.name} className="flex items-center justify-between text-xs">
              <div className="flex items-center gap-2">
                <div className="w-3 h-3 rounded-full" style={{ backgroundColor: s.color }} />
                <span className="text-gray-600">{s.name}</span>
              </div>
              <span className="font-semibold text-gray-800">{s.value.toLocaleString()}</span>
            </div>
          ))}
        </div>
      </div>

      {/* Gráfica de barras — Clientes por país */}
      <div className="bg-white rounded-xl border border-gray-200 p-6 lg:col-span-2">
        <h3 className="text-sm font-semibold text-gray-700 mb-4">Clientes por país</h3>
        <ResponsiveContainer width="100%" height={240}>
          <BarChart data={clientesPorPais} margin={{ top: 0, right: 10, left: -20, bottom: 0 }}>
            <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
            <XAxis dataKey="pais" tick={{ fontSize: 11 }} />
            <YAxis tick={{ fontSize: 11 }} />
            <Tooltip formatter={(value: number) => [value.toLocaleString(), 'Clientes']} />
            <Bar dataKey="total" fill="#6366f1" radius={[4, 4, 0, 0]} />
          </BarChart>
        </ResponsiveContainer>
      </div>

      {/* Gráfica de línea — Tendencia mensual */}
      {clientesPorMes.length > 0 && (
        <div className="bg-white rounded-xl border border-gray-200 p-6 lg:col-span-3">
          <h3 className="text-sm font-semibold text-gray-700 mb-4">Nuevos clientes por mes</h3>
          <ResponsiveContainer width="100%" height={200}>
            <LineChart data={clientesPorMes} margin={{ top: 0, right: 10, left: -20, bottom: 0 }}>
              <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
              <XAxis dataKey="mes" tick={{ fontSize: 11 }} />
              <YAxis tick={{ fontSize: 11 }} />
              <Tooltip formatter={(value: number) => [value.toLocaleString(), 'Clientes']} />
              <Legend />
              <Line
                type="monotone"
                dataKey="total"
                stroke="#6366f1"
                strokeWidth={2}
                dot={{ fill: '#6366f1', r: 4 }}
                name="Nuevos clientes"
              />
            </LineChart>
          </ResponsiveContainer>
        </div>
      )}
    </div>
  )
}
