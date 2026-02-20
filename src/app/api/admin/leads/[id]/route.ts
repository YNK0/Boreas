import { NextRequest, NextResponse } from 'next/server'
import { verifyAdmin } from '@/lib/admin/verify-admin'

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const result = await verifyAdmin(request)
  if (result.error) {
    return NextResponse.json({ error: result.error }, { status: result.status })
  }
  const { supabase } = result
  const { id } = await params

  const { data, error } = await supabase
    .from('leads')
    .select('*')
    .eq('id', id)
    .single()

  if (error || !data) {
    return NextResponse.json({ error: 'Not found' }, { status: 404 })
  }

  return NextResponse.json({ data })
}
