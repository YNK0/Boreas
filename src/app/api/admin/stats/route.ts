import { NextRequest, NextResponse } from 'next/server'
import { verifyAdmin } from '@/lib/admin/verify-admin'

export async function GET(request: NextRequest) {
  const result = await verifyAdmin(request)
  if (result.error) {
    return NextResponse.json({ error: result.error }, { status: result.status })
  }
  const { supabase } = result

  const oneWeekAgo = new Date(Date.now() - 7 * 24 * 60 * 60 * 1000).toISOString()

  const [
    { count: leadsTotal },
    { count: leadsNew },
    { count: leadsThisWeek },
    { count: visitsTotal },
    { count: formsSubmitted },
  ] = await Promise.all([
    supabase.from('leads').select('*', { count: 'exact', head: true }),
    supabase.from('leads').select('*', { count: 'exact', head: true }).eq('status', 'new'),
    supabase.from('leads').select('*', { count: 'exact', head: true }).gte('created_at', oneWeekAgo),
    supabase.from('landing_analytics').select('*', { count: 'exact', head: true }),
    supabase.from('landing_analytics').select('*', { count: 'exact', head: true }).eq('form_submitted', true),
  ])

  const conversionRate =
    (visitsTotal ?? 0) > 0
      ? parseFloat((((formsSubmitted ?? 0) / (visitsTotal ?? 1)) * 100).toFixed(2))
      : 0

  return NextResponse.json({
    leads_total: leadsTotal ?? 0,
    leads_new: leadsNew ?? 0,
    leads_this_week: leadsThisWeek ?? 0,
    visits_total: visitsTotal ?? 0,
    conversion_rate: conversionRate,
  })
}
