import { NextRequest, NextResponse } from 'next/server'
import { getAllClients, createClient } from '@/services/clientsService'
import { createClient as createSupabaseClient } from '@/lib/supabase-server'
import { prisma } from '@/lib/prisma'

async function getCurrentUser() {
  const supabase = await createSupabaseClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) return null

  const profile = await prisma.profile.findUnique({ where: { id: user.id } })
  return profile
}

export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url)
  const page = Number(searchParams.get('page') ?? '1')
  const limit = Number(searchParams.get('limit') ?? '25')
  const search = searchParams.get('search') ?? ''

  const profile = await getCurrentUser()
  const isAdmin = profile?.role === 'admin'

  const result = await getAllClients({
    page,
    limit,
    search,
    userId: profile?.id ?? null,
    isAdmin,
  })
  return NextResponse.json(result)
}

export async function POST(request: NextRequest) {
  const body = await request.json()
  const profile = await getCurrentUser()
  const client = await createClient(body, profile?.id ?? null)
  return NextResponse.json(client, { status: 201 })
}
