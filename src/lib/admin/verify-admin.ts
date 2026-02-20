import { createClient } from '@/lib/supabase/server'
import { NextRequest } from 'next/server'

type VerifyError = { error: string; status: 401 | 403 | 503; supabase?: never; userId?: never }
type VerifySuccess = { error: null; supabase: Awaited<ReturnType<typeof createClient>>; userId: string; status?: never }
type VerifyResult = VerifyError | VerifySuccess

export async function verifyAdmin(request?: NextRequest): Promise<VerifyResult> {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()

  if (!user) {
    return { error: 'Unauthorized', status: 401 }
  }

  const { data: profile, error: profileError } = await supabase
    .from('users')
    .select('role')
    .eq('id', user.id)
    .single() as { data: { role: string } | null; error: any }

  if (profileError) {
    return { error: 'Service Unavailable', status: 503 }
  }

  if (!profile || profile.role !== 'admin') {
    return { error: 'Forbidden', status: 403 }
  }

  return { error: null, supabase, userId: user.id }
}
