/**
 * Integration tests for GET /api/admin/leads
 *
 * Strategy: mock verifyAdmin at module level so we can control auth outcomes,
 * and mock the supabase query chain returned on success.
 *
 * @jest-environment node
 */

import { NextRequest } from 'next/server'

// --- verifyAdmin mock ---
const mockSupabaseFrom = jest.fn()
const mockAdminSupabase = { from: mockSupabaseFrom }

jest.mock('@/lib/admin/verify-admin', () => ({
  verifyAdmin: jest.fn(),
}))

import { verifyAdmin } from '@/lib/admin/verify-admin'
import { GET } from '@/app/api/admin/leads/route'

const mockVerifyAdmin = verifyAdmin as jest.MockedFunction<typeof verifyAdmin>

// Helper: build a chainable query stub
function queryStub(result: object) {
  const chain: any = {
    select: jest.fn().mockReturnThis(),
    eq: jest.fn().mockReturnThis(),
    order: jest.fn().mockReturnThis(),
    range: jest.fn().mockResolvedValue(result),
  }
  return chain
}

function makeRequest(url: string): NextRequest {
  return new NextRequest(url)
}

describe('GET /api/admin/leads', () => {
  beforeEach(() => {
    jest.clearAllMocks()
  })

  it('returns 401 when not authenticated', async () => {
    mockVerifyAdmin.mockResolvedValue({ error: 'Unauthorized', status: 401 } as any)
    const res = await GET(makeRequest('http://localhost/api/admin/leads'))
    expect(res.status).toBe(401)
    const body = await res.json()
    expect(body.error).toBe('Unauthorized')
  })

  it('returns 403 when user is not admin', async () => {
    mockVerifyAdmin.mockResolvedValue({ error: 'Forbidden', status: 403 } as any)
    const res = await GET(makeRequest('http://localhost/api/admin/leads'))
    expect(res.status).toBe(403)
    const body = await res.json()
    expect(body.error).toBe('Forbidden')
  })

  it('returns 503 when verifyAdmin encounters database error', async () => {
    mockVerifyAdmin.mockResolvedValue({ error: 'Service Unavailable', status: 503 } as any)
    const res = await GET(makeRequest('http://localhost/api/admin/leads'))
    expect(res.status).toBe(503)
    const body = await res.json()
    expect(body.error).toBe('Service Unavailable')
  })

  it('returns paginated leads list on success', async () => {
    const leads = [{ id: '1', name: 'Ana', status: 'new' }]
    const stub = queryStub({ data: leads, count: 1, error: null })
    mockSupabaseFrom.mockReturnValue(stub)
    mockVerifyAdmin.mockResolvedValue({ error: null, supabase: mockAdminSupabase, userId: 'admin-1' } as any)

    const res = await GET(makeRequest('http://localhost/api/admin/leads'))
    expect(res.status).toBe(200)
    const body = await res.json()
    expect(body.data).toEqual(leads)
    expect(body.total).toBe(1)
    expect(body.page).toBe(1)
    expect(body.limit).toBe(50)
  })

  it('filters by status when ?status= is provided', async () => {
    const stub = queryStub({ data: [], count: 0, error: null })
    mockSupabaseFrom.mockReturnValue(stub)
    mockVerifyAdmin.mockResolvedValue({ error: null, supabase: mockAdminSupabase, userId: 'admin-1' } as any)

    await GET(makeRequest('http://localhost/api/admin/leads?status=won'))
    expect(stub.eq).toHaveBeenCalledWith('status', 'won')
  })

  it('filters by business_type when provided', async () => {
    const stub = queryStub({ data: [], count: 0, error: null })
    mockSupabaseFrom.mockReturnValue(stub)
    mockVerifyAdmin.mockResolvedValue({ error: null, supabase: mockAdminSupabase, userId: 'admin-1' } as any)

    await GET(makeRequest('http://localhost/api/admin/leads?business_type=salon'))
    expect(stub.eq).toHaveBeenCalledWith('business_type', 'salon')
  })

  it('respects page and limit query params', async () => {
    const stub = queryStub({ data: [], count: 0, error: null })
    mockSupabaseFrom.mockReturnValue(stub)
    mockVerifyAdmin.mockResolvedValue({ error: null, supabase: mockAdminSupabase, userId: 'admin-1' } as any)

    const res = await GET(makeRequest('http://localhost/api/admin/leads?page=2&limit=10'))
    const body = await res.json()
    expect(body.page).toBe(2)
    expect(body.limit).toBe(10)
    expect(stub.range).toHaveBeenCalledWith(10, 19)
  })

  it('caps limit at 100', async () => {
    const stub = queryStub({ data: [], count: 0, error: null })
    mockSupabaseFrom.mockReturnValue(stub)
    mockVerifyAdmin.mockResolvedValue({ error: null, supabase: mockAdminSupabase, userId: 'admin-1' } as any)

    const res = await GET(makeRequest('http://localhost/api/admin/leads?limit=999'))
    const body = await res.json()
    expect(body.limit).toBe(100)
  })

  it('returns 500 on database error', async () => {
    const stub = queryStub({ data: null, count: null, error: { message: 'DB fail' } })
    mockSupabaseFrom.mockReturnValue(stub)
    mockVerifyAdmin.mockResolvedValue({ error: null, supabase: mockAdminSupabase, userId: 'admin-1' } as any)

    const res = await GET(makeRequest('http://localhost/api/admin/leads'))
    expect(res.status).toBe(500)
    const body = await res.json()
    expect(body.error).toBe('Database error')
  })
})
