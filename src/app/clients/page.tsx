'use client'

import { useState, useEffect } from 'react'
import { Client } from '@/types'
import ClientsTable from '@/components/ClientsTable'
import AICopilot from '@/components/AICopilot'
import AddClientModal from '@/components/AddClientModal'
import { UserPlus } from 'lucide-react'

export default function ClientsPage() {
  const [clients, setClients] = useState<Client[]>([])
  const [selectedClient, setSelectedClient] = useState<Client | null>(null)
  const [loading, setLoading] = useState(true)
  const [showModal, setShowModal] = useState(false)

  useEffect(() => {
    fetch('/api/clients')
      .then((res) => res.json())
      .then((data) => {
        setClients(data)
        setLoading(false)
      })
      .catch(() => setLoading(false))
  }, [])

  function handleSelect(client: Client) {
    setSelectedClient((prev) => (prev?.id === client.id ? null : client))
  }

  function handleCreated(client: Client) {
    setClients((prev) => [client, ...prev])
  }

  async function handleDelete(id: number) {
    await fetch(`/api/clients/${id}`, { method: 'DELETE' })
    setClients((prev) => prev.filter((c) => c.id !== id))
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

      {/* Layout tabla + copiloto */}
      <div className="flex gap-6 items-start">
        <div className="flex-1 min-w-0">
          <ClientsTable
            clients={clients}
            loading={loading}
            selectedId={selectedClient?.id ?? null}
            onSelect={handleSelect}
            onDelete={handleDelete}
          />
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