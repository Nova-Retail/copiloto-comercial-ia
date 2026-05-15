'use client'

import { useState, useEffect, useCallback } from 'react'
import { Client } from '@/types'
import ClientsTable from '@/components/ClientsTable'
import AICopilot from '@/components/AICopilot'
import AddClientModal from '@/components/AddClientModal'
import { UserPlus, Search, ChevronLeft, ChevronRight } from 'lucide-react'

export default function ClientsPage() {
  const [clients, setClients] = useState<Client[]>([])
  const [selectedClient, setSelectedClient] = useState<Client | null>(null)
  const [loading, setLoading] = useState(true)
  const [showModal, setShowModal] = useState(false)

  // Paginación y búsqueda
  const [search, setSearch] = useState('')
  const [searchInput, setSearchInput] = useState('')
  const [page, setPage] = useState(1)
  const [total, setTotal] = useState(0)
  const [totalPages, setTotalPages] = useState(1)
  const LIMIT = 25

  const fetchClients = useCallback(async () => {
    setLoading(true)
    try {
      const params = new URLSearchParams({
        page: String(page),
        limit: String(LIMIT),
        search,
      })
      const res = await fetch(`/api/clients?${params}`)
      const data = await res.json()
      setClients(data.clients)
      setTotal(data.total)
      setTotalPages(data.totalPages)
    } catch {
      // error silencioso
    } finally {
      setLoading(false)
    }
  }, [page, search])

  useEffect(() => {
    fetchClients()
  }, [fetchClients])

  // Búsqueda con debounce
  useEffect(() => {
    const timer = setTimeout(() => {
      setSearch(searchInput)
      setPage(1)
    }, 400)
    return () => clearTimeout(timer)
  }, [searchInput])

  function handleSelect(client: Client) {
    setSelectedClient((prev) => (prev?.id === client.id ? null : client))
  }

  function handleCreated(client: Client) {
    setClients((prev) => [client, ...prev])
    setTotal((prev) => prev + 1)
  }

  async function handleDelete(id: number) {
    await fetch(`/api/clients/${id}`, { method: 'DELETE' })
    setClients((prev) => prev.filter((c) => c.id !== id))
    setTotal((prev) => prev - 1)
    if (selectedClient?.id === id) setSelectedClient(null)
  }

  return (
    <div className="p-8 max-w-7xl mx-auto">
      {/* Header */}
      <div className="mb-6 flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Clientes</h1>
          <p className="text-gray-500 mt-1">
            Gestiona tu cartera y analiza cada cliente con el Copiloto IA
          </p>
        </div>
        <button
          onClick={() => setShowModal(true)}
          className="flex items-center gap-2 bg-indigo-600 hover:bg-indigo-700 text-white text-sm font-medium px-4 py-2.5 rounded-lg transition-colors cursor-pointer"
        >
          <UserPlus size={16} />
          Nuevo cliente
        </button>
      </div>

      {/* Buscador */}
      <div className="mb-4 relative">
        <Search size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
        <input
          type="text"
          placeholder="Buscar por nombre, email, ciudad, país o interés..."
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

      {/* Layout tabla + copiloto */}
      <div className="flex gap-6 items-start">
        <div className="flex-1 min-w-0">
          <ClientsTable
            clients={clients}
            loading={loading}
            total={total}
            selectedId={selectedClient?.id ?? null}
            onSelect={handleSelect}
            onDelete={handleDelete}
          />

          {/* Paginación */}
          {totalPages > 1 && (
            <div className="mt-4 flex items-center justify-between">
              <p className="text-sm text-gray-500">
                Mostrando {((page - 1) * LIMIT) + 1}–{Math.min(page * LIMIT, total)} de {total} clientes
                {search && ` para "${search}"`}
              </p>
              <div className="flex items-center gap-2">
                <button
                  onClick={() => setPage((p) => Math.max(1, p - 1))}
                  disabled={page === 1}
                  className="p-2 rounded-lg border border-gray-200 hover:bg-gray-50 disabled:opacity-40 disabled:cursor-not-allowed cursor-pointer transition-colors"
                >
                  <ChevronLeft size={16} />
                </button>
                <div className="flex items-center gap-1">
                  {Array.from({ length: Math.min(5, totalPages) }, (_, i) => {
                    let pageNum
                    if (totalPages <= 5) {
                      pageNum = i + 1
                    } else if (page <= 3) {
                      pageNum = i + 1
                    } else if (page >= totalPages - 2) {
                      pageNum = totalPages - 4 + i
                    } else {
                      pageNum = page - 2 + i
                    }
                    return (
                      <button
                        key={pageNum}
                        onClick={() => setPage(pageNum)}
                        className={`w-8 h-8 text-xs rounded-lg transition-colors cursor-pointer ${
                          page === pageNum
                            ? 'bg-indigo-600 text-white'
                            : 'border border-gray-200 hover:bg-gray-50 text-gray-600'
                        }`}
                      >
                        {pageNum}
                      </button>
                    )
                  })}
                </div>
                <button
                  onClick={() => setPage((p) => Math.min(totalPages, p + 1))}
                  disabled={page === totalPages}
                  className="p-2 rounded-lg border border-gray-200 hover:bg-gray-50 disabled:opacity-40 disabled:cursor-not-allowed cursor-pointer transition-colors"
                >
                  <ChevronRight size={16} />
                </button>
              </div>
            </div>
          )}
        </div>

        {selectedClient && (
          <div className="w-80 shrink-0">
            <AICopilot
              client={selectedClient}
              onClose={() => setSelectedClient(null)}
            />
          </div>
        )}
      </div>

      {/* Modal agregar cliente */}
      {showModal && (
        <AddClientModal
          onClose={() => setShowModal(false)}
          onCreated={handleCreated}
        />
      )}
    </div>
  )
}
