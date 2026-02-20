import { createServerClient } from '@supabase/ssr'
import { NextResponse, type NextRequest } from 'next/server'

export async function updateSession(request: NextRequest) {
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

  // IMPORTANT: Avoid writing any logic between createServerClient and
  // supabase.auth.getUser(). A simple mistake could make it very hard to debug
  // issues with users being randomly logged out.

  const {
    data: { user },
  } = await supabase.auth.getUser()

  const url = request.nextUrl.clone()

  // --- Admin panel protection (/admin/*) ---
  // The admin panel is only accessible via direct URL — no public links.
  // Requires an authenticated Supabase user with role = 'admin'.
  //
  // NOTE: This middleware intentionally has NO rules for /dashboard or /auth/*
  // because those routes no longer exist in this project. The /admin/* block
  // below is the only route-level protection needed.

  const isAdminRoute = url.pathname.startsWith('/admin')
  const isAdminLogin = url.pathname === '/admin/login'
  const isAdminUnauthorized = url.pathname === '/admin/unauthorized'

  if (isAdminRoute && !isAdminLogin && !isAdminUnauthorized) {
    // Not authenticated → redirect to admin login
    if (!user) {
      url.pathname = '/admin/login'
      return NextResponse.redirect(url)
    }

    // Authenticated but need to verify admin role
    const { data: profile, error: profileError } = await supabase
      .from('users')
      .select('role')
      .eq('id', user.id)
      .single()

    if (profileError || !profile || profile.role !== 'admin') {
      if (profileError && process.env.NODE_ENV === 'development') {
        console.error('[Admin Middleware] Role check failed:', profileError.message)
      }
      url.pathname = '/admin/unauthorized'
      return NextResponse.redirect(url)
    }
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
      // On error, let user stay on login page rather than redirect
      return supabaseResponse
    }

    if (profile?.role === 'admin') {
      url.pathname = '/admin/dashboard'
      return NextResponse.redirect(url)
    }
  }

  // IMPORTANT: You *must* return the supabaseResponse object as it is. If you're
  // creating a new response object with NextResponse.next() make sure to:
  // 1. Pass the request in it, like so:
  //    const myNewResponse = NextResponse.next({ request })
  // 2. Copy over the cookies, like so:
  //    myNewResponse.cookies.setAll(supabaseResponse.cookies.getAll())
  // 3. Change the myNewResponse object to fit your needs, but avoid changing
  //    the cookies!
  // 4. Finally:
  //    return myNewResponse
  // If this is not done, you may be causing the browser and server to go out
  // of sync and terminate the user's session prematurely!

  return supabaseResponse
}
