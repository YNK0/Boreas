import { NextRequest, NextResponse } from 'next/server'
import { verifyAdmin } from '@/lib/admin/verify-admin'

export async function GET(request: NextRequest) {
  const result = await verifyAdmin(request)
  if (result.error) {
    return NextResponse.json({ error: result.error }, { status: result.status })
  }
  const { supabase } = result

  const { searchParams } = request.nextUrl
  const status = searchParams.get('status')
  const businessType = searchParams.get('business_type')
  const page = Math.max(1, parseInt(searchParams.get('page') || '1'))
  const limit = Math.min(100, Math.max(1, parseInt(searchParams.get('limit') || '50')))
  const order = searchParams.get('order') === 'asc' ? 'asc' : 'desc'
  const offset = (page - 1) * limit

  let query = supabase.from('leads').select('*', { count: 'exact' })

  if (status) query = query.eq('status', status)
  if (businessType) query = query.eq('business_type', businessType)

  query = query.order('created_at', { ascending: order === 'asc' })
  query = query.range(offset, offset + limit - 1)

  const { data, count, error } = await query

  if (error) {
    return NextResponse.json({ error: 'Database error' }, { status: 500 })
  }

  return NextResponse.json({ data: data ?? [], total: count ?? 0, page, limit })
}
