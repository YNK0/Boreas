import { createClient } from '@/lib/supabase/server'
import { StatusBadge } from '@/components/admin/status-badge'
import { AdminHeader } from '@/components/admin/admin-header'
import Link from 'next/link'
import type { Metadata } from 'next'

export const metadata: Metadata = { title: 'Leads' }

interface PageProps {
  searchParams: Promise<{ status?: string; business_type?: string; page?: string }>
}

export default async function AdminLeadsPage({ searchParams }: PageProps) {
  const supabase = await createClient()
  const params = await searchParams
  const status = params.status || ''
  const businessType = params.business_type || ''
  const page = Math.max(1, parseInt(params.page || '1'))
  const limit = 50
  const offset = (page - 1) * limit

  let query = supabase.from('leads').select('*', { count: 'exact' })
  if (status) query = query.eq('status', status)
  if (businessType) query = query.eq('business_type', businessType)
  query = query.order('created_at', { ascending: false }).range(offset, offset + limit - 1)

  const { data: leads, count } = await query
  const total = count ?? 0
  const totalPages = Math.ceil(total / limit)

  const statusOptions = ['', 'new', 'contacted', 'demo_scheduled', 'demo_completed', 'proposal_sent', 'won', 'lost', 'nurturing']
  const businessOptions = ['', 'salon', 'restaurant', 'clinic', 'dentist', 'veterinary', 'spa', 'gym', 'retail', 'other']

  return (
    <div>
      <AdminHeader />
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="flex items-center justify-between mb-6">
          <h1 className="text-2xl font-semibold text-gray-900">Leads ({total})</h1>
        </div>

        {/* Filters */}
        <form method="GET" className="flex gap-3 mb-6">
          <select
            name="status"
            defaultValue={status}
            data-testid="filter-status"
            className="px-3 py-2 border border-gray-300 rounded-md text-sm bg-white text-gray-700 focus:outline-none focus:ring-1 focus:ring-gray-400"
          >
            <option value="">Todos los status</option>
            {statusOptions.filter(Boolean).map(s => (
              <option key={s} value={s}>{s}</option>
            ))}
          </select>
          <select
            name="business_type"
            defaultValue={businessType}
            className="px-3 py-2 border border-gray-300 rounded-md text-sm bg-white text-gray-700 focus:outline-none focus:ring-1 focus:ring-gray-400"
          >
            <option value="">Todos los tipos</option>
            {businessOptions.filter(Boolean).map(b => (
              <option key={b} value={b}>{b}</option>
            ))}
          </select>
          <button
            type="submit"
            className="px-4 py-2 bg-gray-800 text-white text-sm rounded-md hover:bg-gray-900"
          >
            Filtrar
          </button>
          {(status || businessType) && (
            <a href="/admin/dashboard/leads" className="px-4 py-2 text-sm text-gray-600 hover:text-gray-900 flex items-center">
              Limpiar filtros
            </a>
          )}
        </form>

        {/* Table */}
        <div className="bg-white rounded-lg shadow-sm overflow-hidden">
          <div className="overflow-x-auto">
            {!leads || leads.length === 0 ? (
              <div className="px-6 py-12 text-center text-sm text-gray-500">
                No hay leads que coincidan con los filtros
              </div>
            ) : (
              <table className="min-w-full divide-y divide-gray-200">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Nombre</th>
                    <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Email</th>
                    <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Empresa</th>
                    <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Tipo</th>
                    <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Score</th>
                    <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
                    <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Fecha</th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {leads.map((lead: any) => (
                    <tr
                      key={lead.id}
                      className="hover:bg-gray-50 cursor-pointer"
                    >
                      <td className="px-4 py-3 text-sm font-medium text-gray-900">
                        <Link href={`/admin/dashboard/leads/${lead.id}`} className="hover:text-blue-600">
                          {lead.name}
                        </Link>
                      </td>
                      <td className="px-4 py-3 text-sm text-gray-600">{lead.email}</td>
                      <td className="px-4 py-3 text-sm text-gray-600">{lead.company ?? '—'}</td>
                      <td className="px-4 py-3 text-sm text-gray-600">{lead.business_type ?? '—'}</td>
                      <td className="px-4 py-3 text-sm text-gray-600">{lead.lead_score}</td>
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

          {/* Pagination */}
          {totalPages > 1 && (
            <div className="px-4 py-3 border-t border-gray-200 flex items-center justify-between text-sm text-gray-600">
              <span>{total} leads en total</span>
              <div className="flex gap-2">
                {page > 1 && (
                  <a
                    href={`/admin/dashboard/leads?status=${status}&business_type=${businessType}&page=${page - 1}`}
                    className="px-3 py-1 border border-gray-300 rounded hover:bg-gray-50"
                  >
                    ← Anterior
                  </a>
                )}
                <span className="px-3 py-1">Página {page} de {totalPages}</span>
                {page < totalPages && (
                  <a
                    href={`/admin/dashboard/leads?status=${status}&business_type=${businessType}&page=${page + 1}`}
                    className="px-3 py-1 border border-gray-300 rounded hover:bg-gray-50"
                  >
                    Siguiente →
                  </a>
                )}
              </div>
            </div>
          )}
        </div>
      </main>
    </div>
  )
}
