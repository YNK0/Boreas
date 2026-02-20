import { createClient } from '@/lib/supabase/server'
import { StatsCard } from '@/components/admin/stats-card'
import { StatusBadge } from '@/components/admin/status-badge'
import { AdminHeader } from '@/components/admin/admin-header'
import Link from 'next/link'
import type { Metadata } from 'next'

export const metadata: Metadata = { title: 'Dashboard' }

export default async function AdminDashboardPage() {
  const supabase = await createClient()
  const oneWeekAgo = new Date(Date.now() - 7 * 24 * 60 * 60 * 1000).toISOString()

  const [
    { count: leadsTotal },
    { count: leadsNew },
    { count: leadsThisWeek },
    { count: visitsTotal },
    { data: recentLeads },
  ] = await Promise.all([
    supabase.from('leads').select('*', { count: 'exact', head: true }),
    supabase.from('leads').select('*', { count: 'exact', head: true }).eq('status', 'new'),
    supabase.from('leads').select('*', { count: 'exact', head: true }).gte('created_at', oneWeekAgo),
    supabase.from('landing_analytics').select('*', { count: 'exact', head: true }),
    supabase.from('leads').select('id,name,email,business_type,status,lead_score,created_at').order('created_at', { ascending: false }).limit(10),
  ])

  const formsResult = await supabase.from('landing_analytics').select('*', { count: 'exact', head: true }).eq('form_submitted', true)
  const formsSubmitted = formsResult.count ?? 0
  const visits = visitsTotal ?? 0
  const conversionRate = visits > 0 ? ((formsSubmitted / visits) * 100).toFixed(1) : '0.0'

  return (
    <div>
      <AdminHeader />
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <h1 className="text-2xl font-semibold text-gray-900 mb-6">Overview</h1>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
          <StatsCard
            title="Total Leads"
            value={leadsTotal ?? 0}
            testId="stat-leads-total"
          />
          <StatsCard
            title="Leads Nuevos"
            value={leadsNew ?? 0}
            subtitle="Sin contactar"
            testId="stat-leads-new"
          />
          <StatsCard
            title="Esta Semana"
            value={leadsThisWeek ?? 0}
            testId="stat-leads-week"
          />
          <StatsCard
            title="Conversión"
            value={`${conversionRate}%`}
            subtitle={`${visits} visitas`}
            testId="stat-conversion"
          />
        </div>

        {/* Recent Leads */}
        <div className="bg-white rounded-lg shadow-sm">
          <div className="px-6 py-4 border-b border-gray-200 flex items-center justify-between">
            <h2 className="text-base font-medium text-gray-900">Leads recientes</h2>
            <Link href="/admin/dashboard/leads" className="text-sm text-blue-600 hover:text-blue-800">
              Ver todos →
            </Link>
          </div>
          <div className="overflow-x-auto">
            {!recentLeads || recentLeads.length === 0 ? (
              <div className="px-6 py-8 text-center text-sm text-gray-500">
                No hay leads todavía
              </div>
            ) : (
              <table className="min-w-full divide-y divide-gray-200">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Nombre</th>
                    <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Email</th>
                    <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Negocio</th>
                    <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Status</th>
                    <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Fecha</th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {recentLeads.map((lead: any) => (
                    <tr key={lead.id} className="hover:bg-gray-50">
                      <td className="px-4 py-3 text-sm text-gray-900">
                        <Link href={`/admin/dashboard/leads/${lead.id}`} className="hover:text-blue-600">
                          {lead.name}
                        </Link>
                      </td>
                      <td className="px-4 py-3 text-sm text-gray-600">{lead.email}</td>
                      <td className="px-4 py-3 text-sm text-gray-600">{lead.business_type ?? '—'}</td>
                      <td className="px-4 py-3"><StatusBadge status={lead.status} /></td>
                      <td className="px-4 py-3 text-sm text-gray-500">
                        {new Date(lead.created_at).toLocaleDateString('es-MX')}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            )}
          </div>
        </div>
      </main>
    </div>
  )
}
