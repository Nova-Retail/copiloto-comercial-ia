import { prisma } from '@/lib/prisma'
import { Customer, Client } from '@/types'

type PrismaCustomer = Awaited<ReturnType<typeof prisma.customer.findUniqueOrThrow>>

function toCustomer(c: PrismaCustomer): Client {
  return {
    id: c.id,
    name: c.fullName,
    fullName: c.fullName,
    email: c.email,
    phone: c.phone,
    city: c.city,
    country: c.country,
    registrationDate: c.registrationDate.toISOString(),
    segment: c.segment,
    status: c.status,
    frequency: c.frequency as Client['frequency'],
    lastPurchase: c.lastPurchase,
    interest: c.interest,
  }
}

export interface ClientsResult {
  clients: Client[]
  total: number
  page: number
  totalPages: number
}

export async function getAllClients(options?: {
  page?: number
  limit?: number
  search?: string
  userId?: string | null
  isAdmin?: boolean
}): Promise<ClientsResult> {
  const page = options?.page ?? 1
  const limit = options?.limit ?? 25
  const search = options?.search ?? ''
  const skip = (page - 1) * limit
  const userId = options?.userId
  const isAdmin = options?.isAdmin ?? false

  const searchFilter = search
    ? {
        OR: [
          { fullName: { contains: search, mode: 'insensitive' as const } },
          { email: { contains: search, mode: 'insensitive' as const } },
          { city: { contains: search, mode: 'insensitive' as const } },
          { country: { contains: search, mode: 'insensitive' as const } },
          { interest: { contains: search, mode: 'insensitive' as const } },
        ],
      }
    : {}

  // Si no es admin, solo ve los clientes asignados a su usuario
  const ownerFilter = !isAdmin && userId ? { assignedUserId: userId } : {}

  const where = { ...searchFilter, ...ownerFilter }

  const [customers, total] = await Promise.all([
    prisma.customer.findMany({
      where,
      orderBy: { registrationDate: 'desc' },
      skip,
      take: limit,
    }),
    prisma.customer.count({ where }),
  ])

  return {
    clients: customers.map(toCustomer),
    total,
    page,
    totalPages: Math.ceil(total / limit),
  }
}

export async function getClientById(id: number): Promise<Client | null> {
  const customer = await prisma.customer.findUnique({ where: { id } })
  if (!customer) return null
  return toCustomer(customer)
}

export async function createClient(
  data: Omit<Customer, 'id' | 'registrationDate'>,
  assignedUserId?: string | null
): Promise<Client> {
  const customer = await prisma.customer.create({
    data: {
      fullName: data.fullName,
      email: data.email,
      phone: data.phone,
      city: data.city,
      country: data.country,
      segment: data.segment,
      status: data.status ?? 'activo',
      frequency: data.frequency,
      lastPurchase: data.lastPurchase,
      interest: data.interest,
      assignedUserId: assignedUserId ?? null,
    },
  })
  return toCustomer(customer)
}

export async function deleteClient(id: number): Promise<void> {
  await prisma.customer.delete({ where: { id } })
}
