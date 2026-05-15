import { NextRequest, NextResponse } from 'next/server'
import { getAllClients, createClient } from '@/services/clientsService'

export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url)
  const page = Number(searchParams.get('page') ?? '1')
  const limit = Number(searchParams.get('limit') ?? '25')
  const search = searchParams.get('search') ?? ''

  const result = await getAllClients({ page, limit, search })
  return NextResponse.json(result)
}

export async function POST(request: NextRequest) {
  const body = await request.json()
  const client = await createClient(body)
  return NextResponse.json(client, { status: 201 })
}