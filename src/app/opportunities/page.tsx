'use client'

import { useState, useEffect, useCallback } from 'react'
import { Opportunity } from '@/types'
import { Search, TrendingUp, ChevronLeft, ChevronRight, DollarSign, Calendar, User } from 'lucide-react'

type OpportunityWithCustomer = Opportunity & { customerName?: string }

const stageConfig: Record<string, { label: string; color: string; bg: string }> = {
  nueva:             { label: 'Nueva',             color: 'text-blue-600',    bg: 'bg-blue-50' },
  seguimiento:       { label: 'Seguimiento',        color: 'text-amber-600',   bg: 'bg-amber-50' },
  propuesta_enviada: { label: 'Propuesta enviada',  color: 'text-purple-600',  bg: 'bg-purple-50' },
  cerrada_ganada:    { label: 'Cerrada ganada',     color: 'text-emerald-600', bg: 'bg-emerald-50' },
  cerrada_perdida:   { label: 'Cerrada perdida',    color: 'text-red-500',     bg: 'bg-red-50' },
}

const priorityConfig: Record<string, { color: string; bg: string }> = {
  Alta:  { color: 'text-red-600',     bg: 'bg-red-50' },
  Media: { color: 'text-amber-600',   bg: 'bg-amber-50' },
  Baja:  { color: 'text-gray-500',    bg: 'bg-gray-100' },
}

function OpportunityCard({ opp }: { opp: OpportunityWithCustomer }) {
  const stage = stageConfig[opp.stage] ?? { label: opp.stage, color: 'text-gray-600', bg: 'bg-gray-50' }
  const priority = priorityConfig[opp.priority] ?? { color: 'text-gray-600', bg: 'bg-gray-100' }
  const date = new Date(opp.createdAt).toLocaleDateString('es-ES', { day: '2-digit', month: 'short', year: 'numeric' })

  return (
    <div className="bg-white rounded-xl border border-gray-200 p-5 hover:shadow-sm transition-shadow">
      <div className="flex items-center justify-between mb-3">
        <span className={`text-xs font-medium px-2.5 py-1 rounded-full ${stage.bg} ${stage.color}`}>
          {stage.label}
        </span>
        <span className={`text-xs font-medium px-2.5 py-1 rounded-full ${priority.bg} ${priority.color}`}>
          {opp.priority}
        </span>
      </div>

      {opp.customerName && (
        <div className="flex items-center gap-2 mb-2">
          <User size={13} className="text-gray-400 shrink-0" />
          <p className="text-sm font-semibold text-gray-900 truncate">{opp.customerName}</p>
        </div>
      )}

      {opp.estimatedValue && (
        <div className="flex items-center gap-2 mb-2">
          <DollarSign size={13} className="text-emerald-500 shrink-0" />
          <p className="text-sm font-bold text-emerald-600">
            ${opp.estimatedValue.toLocaleString('es-ES', { minimumFractionDigits: 2 })}
          </p>
        </div>
      )}

      {opp.notes && (
        <p className="text-xs text-gray-500 mt-2 line-clamp-2">{opp.notes}</p>
      )}

      <div className="flex items-center gap-1.5 mt-3 pt-3 border-t border-gray-50">
        <Calendar size={11} className="text-gray-400" />
        <span className="text-xs text-gray-400">{date}</span>
      </div>
    </div>
  )
}

export default function OpportunitiesPage() {
  const [opportunities, setOpportunities] = useState<OpportunityWithCustomer[]>([])
  const [loading, setLoading] = useState(true)
  const [searchInput, setSearchInput] = useState('')
  const [search, setSearch] = useState('')
  const [selectedStage, setSelectedStage] = useState('')
  const [selectedPriority, setSelectedPriority] = useState('')
  const [page, setPage] = useState(1)
  const [total, setTotal] = useState(0)
  const [totalPages, setTotalPages] = useState(1)
  const LIMIT = 20

  const fetchOpportunities = useCallback(async () => {
    setLoading(true)
    try {
      const params = new URLSearchParams({
        page: String(page),
        limit: String(LIMIT),
        search,
        stage: selectedStage,
        priority: selectedPriority,
      })
      const res = await fetch(`/api/opportunities?${params}`)
      const data = await res.json()
      setOpportunities(data.opportunities)
      setTotal(data.total)
      setTotalPages(data.totalPages)
    } catch {
      // error silencioso
    } finally {
      setLoading(false)
    }
  }, [page, search, selectedStage, selectedPriority])

  useEffect(() => { fetchOpportunities() }, [fetchOpportunities])

  useEffect(() => {
    const timer = setTimeout(() => { setSearch(searchInput); setPage(1) }, 400)
    return () => clearTimeout(timer)
  }, [searchInput])

  function handleStage(stage: string) {
    setSelectedStage(stage === selectedStage ? '' : stage)
    setPage(1)
  }

  function handlePriority(priority: string) {
    setSelectedPriority(priority === selectedPriority ? '' : priority)
    setPage(1)
  }

  // KPIs
  const totalValor = opportunities.reduce((sum, o) => sum + (o.estimatedValue ?? 0), 0)
  const ganadas = opportunities.filter(o => o.stage === 'cerrada_ganada').length

  return (
    <div className="p-8 max-w-7xl mx-auto">
      {/* Header */}
      <div className="mb-6 flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Oportunidades</h1>
          <p className="text-gray-500 mt-1">Pipeline comercial de NovaRetail</p>
        </div>
        <div className="flex items-center gap-4">
          <div className="text-right">
            <p className="text-xs text-gray-400">Valor total</p>
            <p className="text-lg font-bold text-emerald-600">
              ${totalValor.toLocaleString('es-ES', { minimumFractionDigits: 2 })}
            </p>
          </div>
          <div className="text-right">
            <p className="text-xs text-gray-400">Ganadas</p>
            <p className="text-lg font-bold text-gray-900">{ganadas}</p>
          </div>
        </div>
      </div>

      {/* Buscador */}
      <div className="mb-4 relative">
        <Search size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
        <input
          type="text"
          placeholder="Buscar por cliente o notas..."
          value={searchInput}
          onChange={(e) => setSearchInput(e.target.value)}
          className="w-full pl-9 pr-4 py-2.5 text-sm border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 bg-white"
        />
        {searchInput && (
          <button
            onClick={() => { setSearchInput(''); setSearch(''); setPage(1) }}
            className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600 cursor-pointer text-xs"
          >
            ✕
          </button>
        )}
      </div>

      {/* Filtros etapa */}
      <div className="flex flex-wrap gap-2 mb-3">
        {Object.entries(stageConfig).map(([key, val]) => (
          <button
            key={key}
            onClick={() => handleStage(key)}
            className={`text-xs font-medium px-3 py-1.5 rounded-full transition-colors cursor-pointer ${
              selectedStage === key ? 'bg-indigo-600 text-white' : `${val.bg} ${val.color} hover:opacity-80`
            }`}
          >
            {val.label}
          </button>
        ))}
      </div>

      {/* Filtros prioridad */}
      <div className="flex gap-2 mb-6">
        {Object.entries(priorityConfig).map(([key, val]) => (
          <button
            key={key}
            onClick={() => handlePriority(key)}
            className={`text-xs font-medium px-3 py-1.5 rounded-full transition-colors cursor-pointer ${
              selectedPriority === key ? 'bg-indigo-600 text-white' : `${val.bg} ${val.color} hover:opacity-80`
            }`}
          >
            {key}
          </button>
        ))}
      </div>

      {/* Grid */}
      {loading ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
          {Array.from({ length: 8 }, (_, i) => (
            <div key={i} className="bg-white rounded-xl border border-gray-200 p-5 animate-pulse">
              <div className="h-4 bg-gray-100 rounded mb-3 w-2/3" />
              <div className="h-4 bg-gray-100 rounded mb-2" />
              <div className="h-4 bg-gray-100 rounded w-1/2" />
            </div>
          ))}
        </div>
      ) : opportunities.length === 0 ? (
        <div className="bg-white rounded-xl border border-gray-200 p-12 text-center">
          <TrendingUp size={40} className="text-gray-300 mx-auto mb-3" />
          <p className="text-gray-500">No se encontraron oportunidades</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
          {opportunities.map((opp) => (
            <OpportunityCard key={opp.id} opp={opp} />
          ))}
        </div>
      )}

      {/* Paginación */}
      {totalPages > 1 && (
        <div className="mt-6 flex items-center justify-between">
          <p className="text-sm text-gray-500">
            Mostrando {((page - 1) * LIMIT) + 1}–{Math.min(page * LIMIT, total)} de {total} oportunidades
          </p>
          <div className="flex items-center gap-2">
            <button
              onClick={() => setPage((p) => Math.max(1, p - 1))}
              disabled={page === 1}
              className="p-2 rounded-lg border border-gray-200 hover:bg-gray-50 disabled:opacity-40 disabled:cursor-not-allowed cursor-pointer"
            >
              <ChevronLeft size={16} />
            </button>
            <span className="text-sm text-gray-600">Página {page} de {totalPages}</span>
            <button
              onClick={() => setPage((p) => Math.min(totalPages, p + 1))}
              disabled={page === totalPages}
              className="p-2 rounded-lg border border-gray-200 hover:bg-gray-50 disabled:opacity-40 disabled:cursor-not-allowed cursor-pointer"
            >
              <ChevronRight size={16} />
            </button>
          </div>
        </div>
      )}
    </div>
  )
}
