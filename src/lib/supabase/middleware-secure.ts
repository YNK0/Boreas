import { createServerClient } from '@supabase/ssr'
import { NextResponse, type NextRequest } from 'next/server'

export async function updateSession(request: NextRequest) {
  const url = request.nextUrl.clone()

  // Early exit for non-admin routes - no auth needed
  if (!url.pathname.startsWith('/admin')) {
    return NextResponse.next()
  }

  let supabaseResponse = NextResponse.next({
    request,
  })

  const supabase = createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        getAll() {
          return request.cookies.getAll()
        },
        setAll(cookiesToSet) {
          cookiesToSet.forEach(({ name, value, options }) => {
            request.cookies.set(name, value)
          })
          supabaseResponse = NextResponse.next({
            request,
          })
          cookiesToSet.forEach(({ name, value, options }) => {
            supabaseResponse.cookies.set(name, value, options)
          })
        },
      },
    }
  )

  // Get user authentication status
  const {
    data: { user },
    error: authError
  } = await supabase.auth.getUser()

  // Define admin route patterns
  const isAdminLogin = url.pathname === '/admin/login'
  const isAdminUnauthorized = url.pathname === '/admin/unauthorized'
  const isProtectedAdminRoute = url.pathname.startsWith('/admin') && !isAdminLogin && !isAdminUnauthorized

  // SECURITY: Block all protected admin routes without valid authentication
  if (isProtectedAdminRoute) {
    // No user session = redirect to login
    if (!user || authError) {
      console.log(`[SECURITY] Blocking unauthenticated access to: ${url.pathname}`)
      url.pathname = '/admin/login'
      url.search = `?redirect=${encodeURIComponent(request.nextUrl.pathname)}`
      return NextResponse.redirect(url)
    }

    // User exists but need to verify admin role
    try {
      const { data: profile, error: profileError } = await supabase
        .from('users')
        .select('role')
        .eq('id', user.id)
        .single()

      // Any database error or missing profile = deny access
      if (profileError || !profile) {
        console.error(`[SECURITY] Database error checking role for user ${user.id}:`, profileError?.message)
        url.pathname = '/admin/unauthorized'
        return NextResponse.redirect(url)
      }

      // Only admin role allowed
      if (profile.role !== 'admin') {
        console.log(`[SECURITY] User ${user.email} with role "${profile.role}" denied admin access`)
        url.pathname = '/admin/unauthorized'
        return NextResponse.redirect(url)
      }

      // Success: user is authenticated admin
      console.log(`[SECURITY] Admin access granted to: ${user.email}`)
    } catch (error) {
      console.error(`[SECURITY] Unexpected error during role check:`, error)
      url.pathname = '/admin/unauthorized'
      return NextResponse.redirect(url)
    }
  }

  // Handle admin login page when user is already authenticated
  if (isAdminLogin && user) {
    try {
      const { data: profile, error: profileError } = await supabase
        .from('users')
        .select('role')
        .eq('id', user.id)
        .single()

      // If user is already admin, redirect to dashboard
      if (!profileError && profile?.role === 'admin') {
        console.log(`[SECURITY] Admin user ${user.email} redirected from login to dashboard`)
        url.pathname = '/admin/dashboard'
        return NextResponse.redirect(url)
      }
    } catch (error) {
      // On error, let them stay on login page
      console.warn(`[SECURITY] Error checking admin status on login page:`, error)
    }
  }

  return supabaseResponse
}