import { prisma } from '@/lib/prisma'
import { Opportunity } from '@/types'

type PrismaOpportunity = Awaited<ReturnType<typeof prisma.opportunity.findUniqueOrThrow>> & {
  customer?: { fullName: string } | null
}

function toOpportunity(o: PrismaOpportunity): Opportunity & { customerName?: string } {
  return {
    id: o.id,
    customerId: o.customerId,
    estimatedValue: o.estimatedValue ? Number(o.estimatedValue) : null,
    stage: o.stage as Opportunity['stage'],
    priority: o.priority as Opportunity['priority'],
    createdAt: o.createdAt.toISOString(),
    notes: o.notes,
    customerName: o.customer?.fullName,
  }
}

export interface OpportunitiesResult {
  opportunities: (Opportunity & { customerName?: string })[]
  total: number
  page: number
  totalPages: number
}

export async function getAllOpportunities(options?: {
  page?: number
  limit?: number
  search?: string
  stage?: string
  priority?: string
}): Promise<OpportunitiesResult> {
  const page = options?.page ?? 1
  const limit = options?.limit ?? 20
  const search = options?.search ?? ''
  const stage = options?.stage ?? ''
  const priority = options?.priority ?? ''
  const skip = (page - 1) * limit

  const where: Record<string, unknown> = {}

  if (search) {
    where.OR = [
      { notes: { contains: search, mode: 'insensitive' } },
      { customer: { is: { fullName: { contains: search, mode: 'insensitive' } } } },
    ]
  }

  if (stage) where.stage = stage
  if (priority) where.priority = priority

  const [opportunities, total] = await Promise.all([
    prisma.opportunity.findMany({
      where,
      include: { customer: { select: { fullName: true } } },
      orderBy: { createdAt: 'desc' },
      skip,
      take: limit,
    }),
    prisma.opportunity.count({ where }),
  ])

  return {
    opportunities: opportunities.map(toOpportunity),
    total,
    page,
    totalPages: Math.ceil(total / limit),
  }
}
