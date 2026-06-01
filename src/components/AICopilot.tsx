'use client'

import { useState } from 'react'
import { Client } from '@/types'
import { calculateScore } from '@/lib/scoring'
import { Bot, Sparkles, Loader2, ChevronRight, X } from 'lucide-react'

interface Props {
  client: Client
  onClose?: () => void
}

function ScoreRow({ label, value, max }: { label: string; value: number; max: number }) {
  return (
    <div className="flex items-center justify-between text-xs">
      <span className="text-gray-500">{label}</span>
      <span className={`font-semibold tabular-nums ${value > 0 ? 'text-emerald-600' : 'text-gray-300'}`}>
        +{value}/{max}
      </span>
    </div>
  )
}

export default function AICopilot({ client, onClose }: Props) {
  const [message, setMessage] = useState<string | null>(null)
  const [loading, setLoading] = useState(false)
  const { score, label, bgColor, color } = calculateScore(client.frequency, client.lastPurchase)

  async function analyze() {
    setLoading(true)
    setMessage(null)
    try {
      const res = await fetch('/api/ai', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(client),
      })
      const data = await res.json()
      setMessage(data.message)
    } catch {
      setMessage('Error al conectar con el copiloto. Por favor intenta de nuevo.')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="bg-white rounded-xl border border-gray-200 overflow-hidden sticky top-6">
      <div className="bg-gradient-to-r from-indigo-600 to-violet-600 px-5 py-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Bot size={18} className="text-white" />
            <h3 className="text-white font-semibold text-sm">Copiloto IA</h3>
          </div>
          {onClose && (
            <button onClick={onClose} className="text-indigo-200 hover:text-white transition-colors cursor-pointer">
              <X size={16} />
            </button>
          )}
        </div>
        <p className="text-indigo-200 text-xs mt-0.5">Análisis comercial inteligente</p>
      </div>

      <div className="px-5 py-4 border-b border-gray-100">
        <p className="text-xs text-gray-400 uppercase tracking-wider mb-2">Cliente analizado</p>
        <p className="font-semibold text-gray-900">{client.name}</p>
        <p className="text-xs text-gray-500 mt-0.5 truncate">{client.interest}</p>
        <div className="flex items-center gap-2 mt-3 flex-wrap">
          <span className={`text-xs font-semibold px-2.5 py-1 rounded-full border ${bgColor} ${color}`}>
            {label} · {score}/100
          </span>
          <span className="text-xs text-gray-400">{client.lastPurchase}d sin compra</span>
        </div>
      </div>

      <div className="px-5 py-4 border-b border-gray-100">
        <p className="text-xs text-gray-400 uppercase tracking-wider mb-3">Desglose de score</p>
        <div className="space-y-2">
          <ScoreRow label="Base" value={50} max={50} />
          <ScoreRow label="Frecuencia (HIGH)" value={client.frequency === 'HIGH' ? 30 : 0} max={30} />
          <ScoreRow label="Recencia (≤10 días)" value={client.lastPurchase <= 10 ? 20 : 0} max={20} />
        </div>
        <div className="mt-3">
          <div className="flex justify-between text-xs text-gray-400 mb-1">
            <span>0</span>
            <span className="font-semibold text-gray-700">{score}/100</span>
            <span>100</span>
          </div>
          <div className="bg-gray-100 rounded-full h-2">
            <div
              className="bg-indigo-500 h-2 rounded-full transition-all duration-500"
              style={{ width: `${score}%` }}
            />
          </div>
        </div>
      </div>

      <div className="px-5 py-4">
        {message && !loading && (
          <div className="mb-4 p-4 bg-gray-50 rounded-lg border border-gray-100 text-sm text-gray-700 leading-relaxed whitespace-pre-line max-h-64 overflow-y-auto">
            {message}
          </div>
        )}

        <button
          onClick={analyze}
          disabled={loading}
          className="w-full flex items-center justify-center gap-2 bg-indigo-600 hover:bg-indigo-700 disabled:opacity-60 disabled:cursor-not-allowed text-white text-sm font-medium py-2.5 px-4 rounded-lg transition-colors cursor-pointer"
        >
          {loading ? (
            <>
              <Loader2 size={15} className="animate-spin" />
              Analizando cliente...
            </>
          ) : (
            <>
              <Sparkles size={15} />
              Analizar cliente
              <ChevronRight size={14} />
            </>
          )}
        </button>

        
      </div>
    </div>
  )
}
