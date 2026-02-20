'use client'

import { useRouter } from 'next/navigation'
import { supabase } from '@/lib/supabase/client'

export function AdminHeader() {
  const router = useRouter()

  const handleSignOut = async () => {
    await supabase.auth.signOut()
    router.push('/admin/login')
  }

  return (
    <header className="bg-white border-b border-gray-200">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4 flex items-center justify-between">
        <div className="flex items-center gap-6">
          <span className="font-semibold text-gray-900">Boreas Admin</span>
          <nav className="flex gap-4 text-sm">
            <a href="/admin/dashboard" className="text-gray-600 hover:text-gray-900">Overview</a>
            <a href="/admin/dashboard/leads" className="text-gray-600 hover:text-gray-900">Leads</a>
            <a href="/admin/dashboard/analytics" className="text-gray-600 hover:text-gray-900">Analytics</a>
          </nav>
        </div>
        <button
          onClick={handleSignOut}
          className="text-sm text-gray-500 hover:text-gray-900"
        >
          Cerrar sesión
        </button>
      </div>
    </header>
  )
}
