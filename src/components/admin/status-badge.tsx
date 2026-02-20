import type { Database } from '@/types/database'

type LeadStatus = Database['public']['Enums']['lead_status']

const STATUS_CONFIG: Record<LeadStatus, { label: string; className: string }> = {
  new: { label: 'Nuevo', className: 'bg-blue-100 text-blue-800' },
  contacted: { label: 'Contactado', className: 'bg-yellow-100 text-yellow-800' },
  demo_scheduled: { label: 'Demo agendada', className: 'bg-orange-100 text-orange-800' },
  demo_completed: { label: 'Demo completada', className: 'bg-purple-100 text-purple-800' },
  proposal_sent: { label: 'Propuesta enviada', className: 'bg-indigo-100 text-indigo-800' },
  won: { label: 'Ganado', className: 'bg-green-100 text-green-800' },
  lost: { label: 'Perdido', className: 'bg-red-100 text-red-800' },
  nurturing: { label: 'Nurturing', className: 'bg-gray-100 text-gray-800' },
}

export function StatusBadge({ status }: { status: string }) {
  const config = STATUS_CONFIG[status as LeadStatus] ?? { label: status, className: 'bg-gray-100 text-gray-800' }
  return (
    <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${config.className}`}>
      {config.label}
    </span>
  )
}
