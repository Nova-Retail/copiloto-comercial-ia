import { prisma } from '@/lib/prisma'
import { Product } from '@/types'

type PrismaProduct = Awaited<ReturnType<typeof prisma.product.findUniqueOrThrow>> & {
  category?: { id: number; name: string } | null
}

function toProduct(p: PrismaProduct): Product {
  return {
    id: p.id,
    name: p.name,
    category: p.category?.name ?? null,
    price: p.price ? Number(p.price) : null,
    stock: p.stock,
    imageUrl: p.imageUrl,
    rating: p.rating ? Number(p.rating) : null,
  }
}

export interface ProductsResult {
  products: Product[]
  total: number
  page: number
  totalPages: number
}

export async function getAllProducts(options?: {
  page?: number
  limit?: number
  search?: string
  category?: string
}): Promise<ProductsResult> {
  const page = options?.page ?? 1
  const limit = options?.limit ?? 24
  const search = options?.search ?? ''
  const category = options?.category ?? ''
  const skip = (page - 1) * limit

  const where: Record<string, unknown> = {}

  if (search) {
    where.OR = [
      { name: { contains: search, mode: 'insensitive' } },
      { category: { is: { name: { contains: search, mode: 'insensitive' } } } },
    ]
  }

  if (category) {
    where.category = { is: { name: { equals: category, mode: 'insensitive' } } }
  }

  const [products, total] = await Promise.all([
    prisma.product.findMany({
      where,
      include: { category: true },
      orderBy: { name: 'asc' },
      skip,
      take: limit,
    }),
    prisma.product.count({ where }),
  ])

  return {
    products: products.map(toProduct),
    total,
    page,
    totalPages: Math.ceil(total / limit),
  }
}

export async function getCategories(): Promise<string[]> {
  const categories = await prisma.category.findMany({
    orderBy: { name: 'asc' },
  })
  return categories.map((c) => c.name)
}