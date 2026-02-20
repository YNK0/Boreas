import { createServerClient } from '@supabase/ssr'
import { NextResponse, type NextRequest } from 'next/server'

export async function updateSession(request: NextRequest) {
  // DEBUG: Log all requests to see if middleware is running
  console.log(`[MIDDLEWARE DEBUG] ${new Date().toISOString()} - Request: ${request.method} ${request.url}`)

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

  const {
    data: { user },
  } = await supabase.auth.getUser()

  // DEBUG: Log user status
  console.log(`[MIDDLEWARE DEBUG] User status:`, user ? `Authenticated (${user.email})` : 'Not authenticated')

  const url = request.nextUrl.clone()

  const isAdminRoute = url.pathname.startsWith('/admin')
  const isAdminLogin = url.pathname === '/admin/login'
  const isAdminUnauthorized = url.pathname === '/admin/unauthorized'

  console.log(`[MIDDLEWARE DEBUG] Route analysis:`, {
    pathname: url.pathname,
    isAdminRoute,
    isAdminLogin,
    isAdminUnauthorized
  })

  if (isAdminRoute && !isAdminLogin && !isAdminUnauthorized) {
    console.log(`[MIDDLEWARE DEBUG] Checking admin access for: ${url.pathname}`)

    // Not authenticated → redirect to admin login
    if (!user) {
      console.log(`[MIDDLEWARE DEBUG] No user found - redirecting to login`)
      url.pathname = '/admin/login'
      return NextResponse.redirect(url)
    }

    // Authenticated but need to verify admin role
    const { data: profile, error: profileError } = await supabase
      .from('users')
      .select('role')
      .eq('id', user.id)
      .single()

    console.log(`[MIDDLEWARE DEBUG] Role check result:`, {
      profile: profile,
      error: profileError?.message,
      hasProfile: !!profile,
      role: profile?.role
    })

    if (profileError || !profile || profile.role !== 'admin') {
      if (profileError && process.env.NODE_ENV === 'development') {
        console.error('[Admin Middleware] Role check failed:', profileError.message)
      }
      console.log(`[MIDDLEWARE DEBUG] Access denied - redirecting to unauthorized`)
      url.pathname = '/admin/unauthorized'
      return NextResponse.redirect(url)
    }

    console.log(`[MIDDLEWARE DEBUG] Admin access granted`)
  }

  // Admin already logged in — redirect away from login page
  if (isAdminLogin && user) {
    const { data: profile, error: profileError } = await supabase
      .from('users')
      .select('role')
      .eq('id', user.id)
      .single()

    if (profileError) {
      if (process.env.NODE_ENV === 'development') {
        console.error('[Admin Middleware] Login redirect check failed:', profileError.message)
      }
      return supabaseResponse
    }

    if (profile?.role === 'admin') {
      console.log(`[MIDDLEWARE DEBUG] Admin user on login page - redirecting to dashboard`)
      url.pathname = '/admin/dashboard'
      return NextResponse.redirect(url)
    }
  }

  console.log(`[MIDDLEWARE DEBUG] Passing request through`)
  return supabaseResponse
}