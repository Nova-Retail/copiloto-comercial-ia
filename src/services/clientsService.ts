import { prisma } from '@/lib/prisma'
import { Client } from '@/types'

type PrismaClientModel = Awaited<ReturnType<typeof prisma.client.findUniqueOrThrow>>

function toClient(c: PrismaClientModel): Client {
  return {
    id: c.id,
    name: c.name,
    email: c.email,
    frequency: c.frequency as Client['frequency'],
    lastPurchase: c.lastPurchase,
    interest: c.interest,
    createdAt: c.createdAt.toISOString(),
  }
}

export async function getAllClients(): Promise<Client[]> {
  const clients = await prisma.client.findMany({ orderBy: { createdAt: 'desc' } })
  return clients.map(toClient)
}

export async function getClientById(id: string): Promise<Client | null> {
  const client = await prisma.client.findUnique({ where: { id } })
  if (!client) return null
  return toClient(client)
}

export async function createClient(
  data: Omit<Client, 'id' | 'createdAt'>
): Promise<Client> {
  const client = await prisma.client.create({ data })
  return toClient(client)
}

export async function deleteClient(id: string): Promise<void> {
  await prisma.client.delete({ where: { id } })
}