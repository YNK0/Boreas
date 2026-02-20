import { NextRequest, NextResponse } from 'next/server'
import { verifyAdmin } from '@/lib/admin/verify-admin'

export async function GET(request: NextRequest) {
  const result = await verifyAdmin(request)
  if (result.error) {
    return NextResponse.json({ error: result.error }, { status: result.status })
  }
  const { supabase } = result

  const { searchParams } = request.nextUrl
  const from = searchParams.get('from')
  const to = searchParams.get('to')
  const page = Math.max(1, parseInt(searchParams.get('page') || '1'))
  const limit = Math.min(200, Math.max(1, parseInt(searchParams.get('limit') || '100')))
  const offset = (page - 1) * limit

  let query = supabase.from('landing_analytics').select('*', { count: 'exact' })

  if (from) query = query.gte('created_at', from)
  if (to) query = query.lte('created_at', to)

  query = query.order('created_at', { ascending: false })
  query = query.range(offset, offset + limit - 1)

  const { data, count, error } = await query

  if (error) {
    return NextResponse.json({ error: 'Database error' }, { status: 500 })
  }

  const rows = data ?? []
  const totalVisits = count ?? 0
  const formsSubmitted = rows.filter((r: any) => r.form_submitted).length
  const conversionRate = totalVisits > 0 ? parseFloat(((formsSubmitted / totalVisits) * 100).toFixed(2)) : 0
  const uniqueSources = [...new Set(rows.map((r: any) => r.utm_source).filter(Boolean))]

  return NextResponse.json({
    data: rows,
    stats: { total_visits: totalVisits, forms_submitted: formsSubmitted, conversion_rate: conversionRate, unique_sources: uniqueSources },
    total: totalVisits,
    page,
    limit,
  })
}
