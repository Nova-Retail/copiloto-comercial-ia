import { NextRequest, NextResponse } from 'next/server'
import { deleteClient } from '@/services/clientsService'

export async function DELETE(
  _req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params
  await deleteClient(id)
  return NextResponse.json({ ok: true })
}
