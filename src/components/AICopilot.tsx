'use client'

import { useState } from 'react'
import { Client } from '@/types'
import { calculateScore } from '@/lib/scoring'
import {
  Bot,
  Sparkles,
  Loader2,
  ChevronRight,
  X,
  ShoppingCart,
  CreditCard,
  Receipt,
  Heart,
} from 'lucide-react'
import { analyzeCustomer } from '@/services/copilotService'
import {
  generateCopilotInsights
} from "@/services/copilotAIService";

interface Props {
  client: Client
  onClose?: () => void
}

function getInitials(name: string) {
  return name
    .split(' ')
    .slice(0, 2)
    .map((n) => n[0])
    .join('')
    .toUpperCase()
}

function RiskBadge({ risk }: { risk: string }) {
  const map: Record<string, { bg: string; text: string; label: string }> = {
    LOW:    { bg: 'bg-emerald-50',  text: 'text-emerald-700', label: 'LOW'    },
    MEDIUM: { bg: 'bg-amber-50',    text: 'text-amber-700',   label: 'MEDIUM' },
    HIGH:   { bg: 'bg-red-50',      text: 'text-red-700',     label: 'HIGH'   },
  }
  const { bg, text, label } = map[risk] ?? map['MEDIUM']
  return (
    <div className={`${bg} border border-transparent rounded-lg p-3 text-center`}>
      <p className="text-[10px] uppercase tracking-widest text-gray-400 mb-1">Riesgo</p>
      <p className={`text-sm font-semibold ${text}`}>{label}</p>
    </div>
  )
}

function KpiCard({
  label,
  value,
  color,
}: {
  label: string
  value: string
  color: string
}) {
  return (
    <div className="bg-gray-50 border border-gray-100 rounded-lg p-3 text-center">
      <p className="text-[10px] uppercase tracking-widest text-gray-400 mb-1">{label}</p>
      <p className={`text-sm font-semibold ${color}`}>{value}</p>
    </div>
  )
}

export default function AICopilot({ client, onClose }: Props) {
  const [analysis, setAnalysis] = useState<any>(null)
  const [loading, setLoading] = useState(false)
  const [copilot, setCopilot] = useState<any>(null);

  async function analyze() {
    setLoading(true)
    try {
      const data = await analyzeCustomer(client.id)
      setAnalysis(data)
      const aiResponse =
  await generateCopilotInsights(
    data
  );

setCopilot(aiResponse);
    } catch {
      setAnalysis(null)
    } finally {
      setLoading(false)
    }
  }

  const churnPct = analysis ? Math.round(analysis.churn_probability * 100) : 0
  const churnColor =
    churnPct >= 70 ? 'text-red-600' : churnPct >= 40 ? 'text-amber-600' : 'text-emerald-600'

  return (
    <div className="bg-white rounded-xl border border-gray-200 overflow-hidden sticky top-6 w-full max-w-sm">

      {/* ── Header ── */}
      <div className="bg-indigo-700 px-5 py-4 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 rounded-full bg-white/15 flex items-center justify-center">
            <Bot size={16} className="text-white" />
          </div>
          <div>
            <p className="text-white text-sm font-medium leading-none">Copiloto IA</p>
            <p className="text-indigo-300 text-[11px] mt-0.5">Análisis comercial inteligente</p>
          </div>
        </div>
        {onClose && (
          <button
            onClick={onClose}
            className="text-indigo-300 hover:text-white transition-colors cursor-pointer"
          >
            <X size={16} />
          </button>
        )}
      </div>

      {/* ── Cliente ── */}
      <div className="px-5 py-4 border-b border-gray-100 flex items-center gap-3">
        <div className="w-10 h-10 rounded-full bg-indigo-100 text-indigo-700 text-sm font-medium flex items-center justify-center flex-shrink-0">
          {getInitials(client.name)}
        </div>
        <div>
          <p className="text-sm font-medium text-gray-900">{client.name}</p>
          <p className="text-[11px] text-gray-400 mt-0.5">
            {client.email} · {client.phone}
          </p>
        </div>
      </div>

      {/* ── CTA ── */}
      <div className="px-4 py-3 border-b border-gray-100">
        <button
          onClick={analyze}
          disabled={loading}
          className="w-full flex items-center justify-center gap-2 bg-indigo-600 hover:bg-indigo-700 disabled:opacity-60 disabled:cursor-not-allowed text-white text-sm font-medium py-2.5 px-4 rounded-lg transition-colors cursor-pointer"
        >
          {loading ? (
            <>
              <Loader2 size={14} className="animate-spin" />
              Analizando cliente…
            </>
          ) : (
            <>
              <Sparkles size={14} />
              Analizar cliente
              <ChevronRight size={13} />
            </>
          )}
        </button>
      </div>

      {/* ── Resultados ── */}
      {analysis && (
        <div className="px-4 py-4 space-y-3">

          {/* Score */}
          <div className="bg-gradient-to-r from-indigo-700 to-violet-600 rounded-xl p-5 text-white">

  <div className="flex items-center justify-between">

    {/* Lado izquierdo */}
    <div className="flex-1">

      <p className="text-[10px] uppercase tracking-[0.2em] text-indigo-200 mb-2">
        Score Comercial
      </p>

      <h2 className="text-4xl font-bold leading-none">
        {analysis.score}
      </h2>

    </div>

    {/* Separador */}
    <div className="mx-5 h-24 w-px bg-white/20" />

    {/* Lado derecho */}
    <div className="flex flex-col items-center min-w-[90px]">

      <p className="text-xs text-indigo-200 mb-2">
        Cliente
      </p>

      <span className="px-4 py-2 rounded-full bg-white/10 border border-white/20 text-white font-bold text-[21px]">
        {analysis.segment}
      </span>

    </div>

  </div>

</div>

          {/* KPIs */}
          <div className="grid grid-cols-3 gap-2">
            <RiskBadge risk={analysis.risk} />
            <KpiCard
              label="Compra"
              value={`${Math.round(analysis.purchase_probability * 100)}%`}
              color="text-indigo-600"
            />
            <KpiCard
              label="Abandono"
              value={`${churnPct}%`}
              color={churnColor}
            />
          </div>

          {/* Estrategia */}
          <div className="border border-gray-200 rounded-lg overflow-hidden">
            <div className="bg-gray-50 px-3 py-2 border-b border-gray-200 flex items-center justify-between">
              <p className="text-[10px] uppercase tracking-widest text-gray-400">
                Estrategia comercial
              </p>
              <span className="text-[10px] font-medium bg-violet-100 text-violet-700 px-2 py-0.5 rounded-full">
                Prioridad {analysis.next_action?.priority}
              </span>
            </div>
            <div className="px-3 py-3 grid grid-cols-2 gap-3">
              <div>
                <p className="text-[10px] text-gray-400 uppercase tracking-widest mb-1">Acción</p>
                <p className="text-[12px] font-semibold text-indigo-700">
                  {analysis.next_action?.action}
                </p>
              </div>
              <div>
                <p className="text-[10px] text-gray-400 uppercase tracking-widest mb-1">
                  Venta cruzada
                </p>
                <p className="text-sm font-medium text-gray-800 break-words">
                  {analysis.commercial_profile?.cross_sell_product ?? 'Sin recomendación'}
                </p>
              </div>
            </div>
          </div>

          {/* Categoría favorita */}
          <div className="bg-amber-50 border border-amber-200 rounded-lg px-3 py-3 flex items-center gap-3">
            <Heart size={18} className="text-amber-500 flex-shrink-0" />
            <div>
              <p className="text-[10px] uppercase tracking-widest text-amber-700 mb-0.5">
                Categoría favorita
              </p>
              <p className="text-sm font-medium text-amber-900">
                {analysis.commercial_profile?.favorite_category ?? 'No disponible'}
              </p>
            </div>
          </div>

          {/* Métricas */}
          <div className="border border-gray-200 rounded-lg divide-y divide-gray-100 overflow-hidden">
            <div className="flex items-center justify-between px-3 py-2.5">
              <span className="flex items-center gap-2 text-xs text-gray-500">
                <ShoppingCart size={13} className="text-gray-400" />
                Pedidos
              </span>
              <span className="text-sm font-semibold text-gray-800">
                {analysis.metrics.total_orders}
              </span>
            </div>
            <div className="flex items-center justify-between px-3 py-2.5">
              <span className="flex items-center gap-2 text-xs text-gray-500">
                <CreditCard size={13} className="text-gray-400" />
                Total gastado
              </span>
              <span className="text-sm font-semibold text-gray-800">
                ${Number(analysis.metrics.total_spent).toLocaleString()}
              </span>
            </div>
            <div className="flex items-center justify-between px-3 py-2.5">
              <span className="flex items-center gap-2 text-xs text-gray-500">
                <Receipt size={13} className="text-gray-400" />
                Ticket promedio
              </span>
              <span className="text-sm font-semibold text-gray-800">
                ${Number(analysis.metrics.avg_ticket).toFixed(2)}
              </span>
            </div>
          </div>

          {/* Explicación IA */}
          {copilot && (

            <div className="border border-blue-200 bg-blue-50 rounded-lg p-3">

              <p className="text-xs uppercase tracking-wider text-blue-600 mb-3">
                Insights IA
              </p>

              <p className="text-sm text-gray-700 whitespace-pre-line">
                {copilot.summary}
              </p>

            </div>     
        )}

        {copilot && (

            <div className="border rounded-lg p-3">

              <p className="font-semibold mb-2">
                WhatsApp
              </p>

              <textarea
                readOnly
                value={copilot.whatsapp}
                className="w-full h-32 text-sm border rounded p-2"
              />

            </div>

            )}


            {copilot && (

            <div className="border rounded-lg p-3">

              <p className="font-semibold mb-2">
                Email
              </p>

              <textarea
                readOnly
                value={copilot.email}
                className="w-full h-40 text-sm border rounded p-2"
              />

            </div>

            )}

        </div>
      )}
    </div>
  )
}