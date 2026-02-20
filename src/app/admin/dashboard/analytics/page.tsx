import { createClient } from '@/lib/supabase/server'
import { StatsCard } from '@/components/admin/stats-card'
import { AdminHeader } from '@/components/admin/admin-header'
import type { Metadata } from 'next'

export const metadata: Metadata = { title: 'Analytics' }

interface PageProps {
  searchParams: Promise<{ from?: string; to?: string; page?: string }>
}

export default async function AdminAnalyticsPage({ searchParams }: PageProps) {
  const supabase = await createClient()
  const params = await searchParams
  const from = params.from || ''
  const to = params.to || ''
  const page = Math.max(1, parseInt(params.page || '1'))
  const limit = 100
  const offset = (page - 1) * limit

  let query = supabase.from('landing_analytics').select('*', { count: 'exact' })
  if (from) query = query.gte('created_at', from)
  if (to) query = query.lte('created_at', to)
  query = query.order('created_at', { ascending: false }).range(offset, offset + limit - 1)

  const { data: rows, count } = await query

  const totalVisits = count ?? 0
  const analyticsRows = rows ?? []
  const formsSubmitted = analyticsRows.filter((r: any) => r.form_submitted).length
  const conversionRate = totalVisits > 0 ? ((formsSubmitted / totalVisits) * 100).toFixed(1) : '0.0'
  const totalPages = Math.ceil(totalVisits / limit)

  return (
    <div>
      <AdminHeader />
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <h1 className="text-2xl font-semibold text-gray-900 mb-6">Analytics</h1>

        {/* Stats */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-8">
          <StatsCard title="Total visitas" value={totalVisits} testId="stat-visits-total" />
          <StatsCard title="Formularios enviados" value={formsSubmitted} testId="stat-forms-submitted" />
          <StatsCard title="Tasa de conversión" value={`${conversionRate}%`} testId="stat-conversion-rate" />
        </div>

        {/* Date filter */}
        <form method="GET" className="flex gap-3 mb-6 items-end">
          <div>
            <label className="block text-xs text-gray-500 mb-1">Desde</label>
            <input
              type="date"
              name="from"
              defaultValue={from}
              className="px-3 py-2 border border-gray-300 rounded-md text-sm bg-white focus:outline-none focus:ring-1 focus:ring-gray-400"
            />
          </div>
          <div>
            <label className="block text-xs text-gray-500 mb-1">Hasta</label>
            <input
              type="date"
              name="to"
              defaultValue={to}
              className="px-3 py-2 border border-gray-300 rounded-md text-sm bg-white focus:outline-none focus:ring-1 focus:ring-gray-400"
            />
          </div>
          <button
            type="submit"
            className="px-4 py-2 bg-gray-800 text-white text-sm rounded-md hover:bg-gray-900"
          >
            Filtrar
          </button>
          {(from || to) && (
            <a href="/admin/dashboard/analytics" className="px-4 py-2 text-sm text-gray-600 hover:text-gray-900">
              Limpiar
            </a>
          )}
        </form>

        {/* Table */}
        <div className="bg-white rounded-lg shadow-sm overflow-hidden">
          <div className="overflow-x-auto">
            {analyticsRows.length === 0 ? (
              <div className="px-6 py-12 text-center text-sm text-gray-500">
                No hay datos de analytics todavía
              </div>
            ) : (
              <table className="min-w-full divide-y divide-gray-200">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Path</th>
                    <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Referrer</th>
                    <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">UTM Source</th>
                    <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Form enviado</th>
                    <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Fecha</th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {analyticsRows.map((row: any) => (
                    <tr key={row.id} className="hover:bg-gray-50">
                      <td className="px-4 py-3 text-sm text-gray-900">{row.page_path}</td>
                      <td className="px-4 py-3 text-sm text-gray-600 max-w-xs truncate">{row.referrer ?? '—'}</td>
                      <td className="px-4 py-3 text-sm text-gray-600">{row.utm_source ?? 'direct'}</td>
                      <td className="px-4 py-3 text-sm">
                        {row.form_submitted ? (
                          <span className="text-green-600 font-medium">✓ Sí</span>
                        ) : (
                          <span className="text-gray-400">No</span>
                        )}
                      </td>
                      <td className="px-4 py-3 text-sm text-gray-500">
                        {new Date(row.created_at).toLocaleDateString('es-MX')}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            )}
          </div>

          {totalPages > 1 && (
            <div className="px-4 py-3 border-t border-gray-200 flex items-center justify-between text-sm text-gray-600">
              <span>{totalVisits} eventos en total</span>
              <div className="flex gap-2">
                {page > 1 && (
                  <a href={`/admin/dashboard/analytics?from=${from}&to=${to}&page=${page - 1}`} className="px-3 py-1 border border-gray-300 rounded hover:bg-gray-50">← Anterior</a>
                )}
                <span className="px-3 py-1">Página {page} de {totalPages}</span>
                {page < totalPages && (
                  <a href={`/admin/dashboard/analytics?from=${from}&to=${to}&page=${page + 1}`} className="px-3 py-1 border border-gray-300 rounded hover:bg-gray-50">Siguiente →</a>
                )}
              </div>
            </div>
          )}
        </div>
      </main>
    </div>
  )
}
