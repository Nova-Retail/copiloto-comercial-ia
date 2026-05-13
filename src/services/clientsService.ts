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

export async function getAllClients(): Promise<Client[]> {
  const customers = await prisma.customer.findMany({
    orderBy: { registrationDate: 'desc' },
  })
  return customers.map(toCustomer)
}

export async function getClientById(id: number): Promise<Client | null> {
  const customer = await prisma.customer.findUnique({ where: { id } })
  if (!customer) return null
  return toCustomer(customer)
}

export async function createClient(
  data: Omit<Customer, 'id' | 'registrationDate'>
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
    },
  })
  return toCustomer(customer)
}

export async function deleteClient(id: number): Promise<void> {
  await prisma.customer.delete({ where: { id } })
}
