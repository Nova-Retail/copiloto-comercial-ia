'use client'

import { useState } from 'react'
import { Client } from '@/types'
import { calculateScore } from '@/lib/scoring'
import { Bot, Trash2, X, MapPin, Phone, Mail, Calendar, Tag } from 'lucide-react'

interface Props {
  clients: Client[]
  loading: boolean
  total: number
  selectedId: number | null
  onSelect: (client: Client) => void
  onDelete: (id: number) => void
}

const freqLabel: Record<string, string> = { HIGH: 'Alta', MEDIUM: 'Media', LOW: 'Baja' }
const freqColor: Record<string, string> = {
  HIGH: 'bg-emerald-100 text-emerald-700',
  MEDIUM: 'bg-amber-100 text-amber-700',
  LOW: 'bg-red-100 text-red-700',
}

export default function ClientsTable({ clients, loading, total, selectedId, onSelect, onDelete }: Props) {
  const [detailClient, setDetailClient] = useState<Client | null>(null)

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
    <>
      <div className="bg-white rounded-xl border border-gray-200 overflow-hidden">
        <div className="px-6 py-4 border-b border-gray-100 flex items-center justify-between">
          <h2 className="text-base font-semibold text-gray-900">
            {total} clientes registrados
          </h2>
          <span className="text-xs text-gray-400 hidden sm:block">
            Haz clic en el nombre para ver detalle · Analizar para el Copiloto IA
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
                      <p
                        className="font-medium text-gray-900 whitespace-nowrap cursor-pointer hover:text-indigo-600 transition-colors"
                        onClick={() => setDetailClient(client)}
                      >
                        {client.name}
                      </p>
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

      {/* Modal de detalle del cliente */}
      {detailClient && (
        <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-2xl shadow-xl w-full max-w-md">
            <div className="flex items-center justify-between px-6 py-4 border-b border-gray-100">
              <div>
                <h2 className="font-semibold text-gray-900">{detailClient.name}</h2>
                <p className="text-xs text-gray-400 mt-0.5">{detailClient.interest}</p>
              </div>
              <button onClick={() => setDetailClient(null)} className="text-gray-400 hover:text-gray-600 cursor-pointer">
                <X size={18} />
              </button>
            </div>

            <div className="px-6 py-4 border-b border-gray-100">
              {(() => {
                const { score, label, bgColor, color } = calculateScore(detailClient.frequency, detailClient.lastPurchase)
                return (
                  <div className="flex items-center gap-3">
                    <span className={`text-sm font-semibold px-3 py-1.5 rounded-full border ${bgColor} ${color}`}>
                      {label} · {score}/100
                    </span>
                    <span className={`text-xs font-medium px-2.5 py-1 rounded-full ${freqColor[detailClient.frequency]}`}>
                      Frecuencia {freqLabel[detailClient.frequency]}
                    </span>
                  </div>
                )
              })()}
            </div>

            <div className="px-6 py-4 space-y-3">
              {detailClient.email && (
                <div className="flex items-center gap-3 text-sm text-gray-600">
                  <Mail size={15} className="text-gray-400 shrink-0" />
                  <span>{detailClient.email}</span>
                </div>
              )}
              {detailClient.phone && (
                <div className="flex items-center gap-3 text-sm text-gray-600">
                  <Phone size={15} className="text-gray-400 shrink-0" />
                  <span>{detailClient.phone}</span>
                </div>
              )}
              {(detailClient.city || detailClient.country) && (
                <div className="flex items-center gap-3 text-sm text-gray-600">
                  <MapPin size={15} className="text-gray-400 shrink-0" />
                  <span>{[detailClient.city, detailClient.country].filter(Boolean).join(', ')}</span>
                </div>
              )}
              {detailClient.segment && (
                <div className="flex items-center gap-3 text-sm text-gray-600">
                  <Tag size={15} className="text-gray-400 shrink-0" />
                  <span className="capitalize">{detailClient.segment}</span>
                </div>
              )}
              <div className="flex items-center gap-3 text-sm text-gray-600">
                <Calendar size={15} className="text-gray-400 shrink-0" />
                <span>{detailClient.lastPurchase} días desde última compra</span>
              </div>
              <div className="flex items-center gap-3 text-sm text-gray-600">
                <span className={`w-2 h-2 rounded-full ${detailClient.status === 'activo' ? 'bg-emerald-400' : 'bg-red-400'}`} />
                <span className="capitalize">Estado: {detailClient.status}</span>
              </div>
            </div>

            <div className="px-6 py-4 border-t border-gray-100 flex justify-end gap-3">
              <button
                onClick={() => setDetailClient(null)}
                className="text-sm text-gray-500 hover:text-gray-700 px-4 py-2 rounded-lg hover:bg-gray-50 cursor-pointer"
              >
                Cerrar
              </button>
              <button
                onClick={() => { onSelect(detailClient); setDetailClient(null) }}
                className="flex items-center gap-2 bg-indigo-600 hover:bg-indigo-700 text-white text-sm font-medium px-4 py-2 rounded-lg transition-colors cursor-pointer"
              >
                <Bot size={14} />
                Analizar con IA
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  )
}