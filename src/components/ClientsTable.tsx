'use client'

import { Client } from '@/types'
import { calculateScore } from '@/lib/scoring'
import { Bot, Trash2 } from 'lucide-react'

interface Props {
  clients: Client[]
  loading: boolean
  selectedId: string | null
  onSelect: (client: Client) => void
  onDelete: (id: string) => void
}

const freqLabel: Record<string, string> = { HIGH: 'Alta', MEDIUM: 'Media', LOW: 'Baja' }
const freqColor: Record<string, string> = {
  HIGH: 'bg-emerald-100 text-emerald-700',
  MEDIUM: 'bg-amber-100 text-amber-700',
  LOW: 'bg-red-100 text-red-700',
}

export default function ClientsTable({ clients, loading, selectedId, onSelect, onDelete }: Props) {
  if (loading) {
    return (
      <div className="bg-white rounded-xl border border-gray-200 p-8">
        <div className="animate-pulse space-y-3">
          {[1, 2, 3, 4, 5].map((i) => (
            <div key={i} className="h-14 bg-gray-100 rounded-lg" />
          ))}
        </div>
      </div>
    )
  }

  return (
    <div className="bg-white rounded-xl border border-gray-200 overflow-hidden">
      <div className="px-6 py-4 border-b border-gray-100 flex items-center justify-between">
        <h2 className="text-base font-semibold text-gray-900">
          {clients.length} clientes registrados
        </h2>
        <span className="text-xs text-gray-400 hidden sm:block">
          Haz clic en "Analizar" para activar el Copiloto IA
        </span>
      </div>

      <div className="overflow-x-auto">
        <table className="w-full text-sm">
          <thead className="bg-gray-50 text-gray-500 text-xs uppercase tracking-wider">
            <tr>
              <th className="px-5 py-3 text-left font-medium whitespace-nowrap">Cliente</th>
              <th className="px-5 py-3 text-left font-medium whitespace-nowrap">Frecuencia</th>
              <th className="px-5 py-3 text-left font-medium whitespace-nowrap">Días sin compra</th>
              <th className="px-5 py-3 text-left font-medium whitespace-nowrap hidden xl:table-cell">Interés</th>
              <th className="px-5 py-3 text-left font-medium whitespace-nowrap">Score</th>
              <th className="px-5 py-3 text-left font-medium whitespace-nowrap">Copiloto</th>
              <th className="px-5 py-3 text-left font-medium whitespace-nowrap"></th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-50">
            {clients.map((client) => {
              const { score, label, bgColor, color } = calculateScore(
                client.frequency,
                client.lastPurchase
              )
              const isSelected = selectedId === client.id

              return (
                <tr
                  key={client.id}
                  className={`transition-colors ${isSelected ? 'bg-indigo-50/60' : 'hover:bg-gray-50'}`}
                >
                  <td className="px-5 py-4">
                    <p className="font-medium text-gray-900 whitespace-nowrap">{client.name}</p>
                    <p className="text-xs text-gray-400 mt-0.5 truncate max-w-[160px]">{client.email}</p>
                  </td>
                  <td className="px-5 py-4">
                    <span className={`text-xs font-medium px-2.5 py-1 rounded-full whitespace-nowrap ${freqColor[client.frequency]}`}>
                      {freqLabel[client.frequency]}
                    </span>
                  </td>
                  <td className="px-5 py-4 text-gray-600 whitespace-nowrap">{client.lastPurchase}d</td>
                  <td className="px-5 py-4 text-gray-600 hidden xl:table-cell">
                    <span className="truncate block max-w-[180px]">{client.interest}</span>
                  </td>
                  <td className="px-5 py-4">
                    <span className={`text-xs font-semibold px-2.5 py-1 rounded-full border whitespace-nowrap ${bgColor} ${color}`}>
                      {label} · {score}
                    </span>
                  </td>
                  <td className="px-5 py-4">
                    <button
                      onClick={() => onSelect(client)}
                      className={`flex items-center gap-1.5 text-xs font-medium px-3 py-1.5 rounded-lg transition-colors cursor-pointer whitespace-nowrap ${
                        isSelected
                          ? 'bg-indigo-600 text-white'
                          : 'bg-indigo-50 text-indigo-600 hover:bg-indigo-100'
                      }`}
                    >
                      <Bot size={13} />
                      {isSelected ? 'Cerrar' : 'Analizar'}
                    </button>
                  </td>
                  <td className="px-5 py-4">
                    <button
                      onClick={() => {
                        if (confirm(`¿Eliminar a ${client.name}?`)) onDelete(client.id)
                      }}
                      className="p-1.5 text-gray-400 hover:text-red-500 hover:bg-red-50 rounded-lg transition-colors cursor-pointer"
                    >
                      <Trash2 size={14} />
                    </button>
                  </td>
                </tr>
              )
            })}
          </tbody>
        </table>
      </div>
    </div>
  )
}
