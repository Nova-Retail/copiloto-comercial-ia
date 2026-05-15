import { NextRequest, NextResponse } from 'next/server'
import { getAllProducts, getCategories } from '@/services/productsService'

export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url)
  const page = Number(searchParams.get('page') ?? '1')
  const limit = Number(searchParams.get('limit') ?? '24')
  const search = searchParams.get('search') ?? ''
  const category = searchParams.get('category') ?? ''
  const categoriesOnly = searchParams.get('categoriesOnly') === 'true'

  if (categoriesOnly) {
    const categories = await getCategories()
    return NextResponse.json(categories)
  }

  const result = await getAllProducts({ page, limit, search, category })
  return NextResponse.json(result)
}
