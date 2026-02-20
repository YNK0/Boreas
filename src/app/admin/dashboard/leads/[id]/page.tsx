import { createClient } from '@/lib/supabase/server'
import { StatusBadge } from '@/components/admin/status-badge'
import { AdminHeader } from '@/components/admin/admin-header'
import Link from 'next/link'
import { notFound } from 'next/navigation'
import type { Metadata } from 'next'

export const metadata: Metadata = { title: 'Detalle Lead' }

interface PageProps {
  params: Promise<{ id: string }>
}

function Field({ label, value }: { label: string; value?: string | number | null }) {
  return (
    <div>
      <dt className="text-sm font-medium text-gray-500">{label}</dt>
      <dd className="mt-1 text-sm text-gray-900">{value ?? '—'}</dd>
    </div>
  )
}

export default async function LeadDetailPage({ params }: PageProps) {
  const supabase = await createClient()
  const { id } = await params

  const { data: lead } = await supabase.from('leads').select('*').eq('id', id).single()

  if (!lead) notFound()

  return (
    <div>
      <AdminHeader />
      <main className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="mb-6">
          <Link href="/admin/dashboard/leads" className="text-sm text-gray-500 hover:text-gray-900">
            ← Volver a leads
          </Link>
        </div>

        <div className="bg-white rounded-lg shadow-sm p-6">
          <div className="flex items-start justify-between mb-6">
            <h1 className="text-xl font-semibold text-gray-900">{(lead as any).name}</h1>
            <StatusBadge status={(lead as any).status} />
          </div>

          <dl className="grid grid-cols-1 sm:grid-cols-2 gap-6">
            <Field label="Email" value={(lead as any).email} />
            <Field label="Teléfono / WhatsApp" value={(lead as any).phone} />
            <Field label="Empresa" value={(lead as any).company} />
            <Field
              label="Tipo de negocio"
              value={(lead as any).business_type}
            />
            <Field label="Mensaje" value={(lead as any).message} />
            <Field label="Lead Score" value={(lead as any).lead_score} />
            <Field label="Fuente (UTM)" value={(lead as any).utm_source} />
            <Field label="Medio (UTM)" value={(lead as any).utm_medium} />
            <Field label="Campaña (UTM)" value={(lead as any).utm_campaign} />
            <Field
              label="Fecha de registro"
              value={new Date((lead as any).created_at).toLocaleString('es-MX')}
            />
          </dl>
        </div>
      </main>
    </div>
  )
}
