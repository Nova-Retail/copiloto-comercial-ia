import { NextRequest, NextResponse } from 'next/server'
import { getAllClients, createClient } from '@/services/clientsService'

export async function GET() {
  const clients = await getAllClients()
  return NextResponse.json(clients)
}

export async function POST(request: NextRequest) {
  const body = await request.json()
  const client = await createClient(body)
  return NextResponse.json(client, { status: 201 })
}
