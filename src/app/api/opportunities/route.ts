import { NextRequest, NextResponse } from 'next/server'
import { getAllOpportunities } from '@/services/opportunitiesService'

export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url)
  const page = Number(searchParams.get('page') ?? '1')
  const limit = Number(searchParams.get('limit') ?? '20')
  const search = searchParams.get('search') ?? ''
  const stage = searchParams.get('stage') ?? ''
  const priority = searchParams.get('priority') ?? ''

  const result = await getAllOpportunities({ page, limit, search, stage, priority })
  return NextResponse.json(result)
}
