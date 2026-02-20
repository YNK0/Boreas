import { createServerClient } from '@supabase/ssr'
import { NextResponse, type NextRequest } from 'next/server'

export async function middleware(request: NextRequest) {
  const url = request.nextUrl.clone()

  // Force debug logging
  console.log(`🔒 [MIDDLEWARE] ${new Date().toISOString()} Processing: ${request.method} ${url.pathname}`)

  // Early exit for non-admin routes
  if (!url.pathname.startsWith('/admin')) {
    console.log(`✅ [MIDDLEWARE] Non-admin route, allowing: ${url.pathname}`)
    return NextResponse.next()
  }

  const isLogin = url.pathname === '/admin/login'
  const isUnauthorized = url.pathname === '/admin/unauthorized'

  // Create Supabase client
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
          cookiesToSet.forEach(({ name, value }) => request.cookies.set(name, value))
          supabaseResponse = NextResponse.next({ request })
          cookiesToSet.forEach(({ name, value, options }) => {
            supabaseResponse.cookies.set(name, value, options)
          })
        },
      },
    }
  )

  // Get user
  const { data: { user }, error: authError } = await supabase.auth.getUser()
  console.log(`🔒 [MIDDLEWARE] Auth check: ${user ? `User: ${user.email}` : 'No user'} ${authError ? `Error: ${authError.message}` : ''}`)

  // SECURITY: Block all admin routes except login/unauthorized if no user
  if (!isLogin && !isUnauthorized) {
    if (!user || authError) {
      console.log(`🚨 [MIDDLEWARE] BLOCKING unauthenticated access to: ${url.pathname}`)
      url.pathname = '/admin/login'
      url.search = `?redirect=${encodeURIComponent(request.nextUrl.pathname)}`
      return NextResponse.redirect(url)
    }

    // Check admin role
    console.log(`🔒 [MIDDLEWARE] Checking admin role for user: ${user.id}`)
    try {
      const { data: profile, error: profileError } = await supabase
        .from('users')
        .select('role')
        .eq('id', user.id)
        .single()

      if (profileError || !profile) {
        console.log(`🚨 [MIDDLEWARE] Database error or missing profile: ${profileError?.message}`)
        url.pathname = '/admin/unauthorized'
        return NextResponse.redirect(url)
      }

      if (profile.role !== 'admin') {
        console.log(`🚨 [MIDDLEWARE] Access denied for role: ${profile.role}`)
        url.pathname = '/admin/unauthorized'
        return NextResponse.redirect(url)
      }

      console.log(`✅ [MIDDLEWARE] Admin access granted to: ${user.email}`)
    } catch (error) {
      console.error(`🚨 [MIDDLEWARE] Exception during role check:`, error)
      url.pathname = '/admin/unauthorized'
      return NextResponse.redirect(url)
    }
  }

  // Handle login redirect for already authenticated admin
  if (isLogin && user) {
    try {
      const { data: profile } = await supabase
        .from('users')
        .select('role')
        .eq('id', user.id)
        .single()

      if (profile?.role === 'admin') {
        console.log(`🔄 [MIDDLEWARE] Redirecting admin from login to dashboard`)
        url.pathname = '/admin/dashboard'
        return NextResponse.redirect(url)
      }
    } catch (error) {
      console.warn(`⚠️ [MIDDLEWARE] Error checking admin on login:`, error)
    }
  }

  console.log(`✅ [MIDDLEWARE] Request allowed: ${url.pathname}`)
  return supabaseResponse
}

export const config = {
  matcher: [
    /*
     * Match all request paths except for:
     * - api (API routes)
     * - _next/static (static files)
     * - _next/image (image optimization files)
     * - favicon.ico (favicon file)
     * - public files (images, etc.)
     */
    '/((?!api|_next/static|_next/image|favicon.ico|.*\\.(?:svg|png|jpg|jpeg|gif|webp)$).*)',
  ],
}