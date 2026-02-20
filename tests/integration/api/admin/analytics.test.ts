/**
 * Integration tests for GET /api/admin/analytics
 *
 * @jest-environment node
 */

import { NextRequest } from 'next/server'

const mockSupabaseFrom = jest.fn()
const mockAdminSupabase = { from: mockSupabaseFrom }

jest.mock('@/lib/admin/verify-admin', () => ({
  verifyAdmin: jest.fn(),
}))

import { verifyAdmin } from '@/lib/admin/verify-admin'
import { GET } from '@/app/api/admin/analytics/route'

const mockVerifyAdmin = verifyAdmin as jest.MockedFunction<typeof verifyAdmin>

function queryStub(result: object) {
  const chain: any = {
    select: jest.fn().mockReturnThis(),
    gte: jest.fn().mockReturnThis(),
    lte: jest.fn().mockReturnThis(),
    order: jest.fn().mockReturnThis(),
    range: jest.fn().mockResolvedValue(result),
  }
  return chain
}

function makeRequest(url: string): NextRequest {
  return new NextRequest(url)
}

describe('GET /api/admin/analytics', () => {
  beforeEach(() => {
    jest.clearAllMocks()
  })

  it('returns 401 when not authenticated', async () => {
    mockVerifyAdmin.mockResolvedValue({ error: 'Unauthorized', status: 401 } as any)
    const res = await GET(makeRequest('http://localhost/api/admin/analytics'))
    expect(res.status).toBe(401)
  })

  it('returns 403 when not admin', async () => {
    mockVerifyAdmin.mockResolvedValue({ error: 'Forbidden', status: 403 } as any)
    const res = await GET(makeRequest('http://localhost/api/admin/analytics'))
    expect(res.status).toBe(403)
  })

  it('returns analytics data with computed stats', async () => {
    const rows = [
      { id: '1', form_submitted: true, utm_source: 'google', created_at: '2026-01-01' },
      { id: '2', form_submitted: false, utm_source: 'facebook', created_at: '2026-01-02' },
      { id: '3', form_submitted: true, utm_source: 'google', created_at: '2026-01-03' },
    ]
    const stub = queryStub({ data: rows, count: 3, error: null })
    mockSupabaseFrom.mockReturnValue(stub)
    mockVerifyAdmin.mockResolvedValue({ error: null, supabase: mockAdminSupabase, userId: 'admin-1' } as any)

    const res = await GET(makeRequest('http://localhost/api/admin/analytics'))
    expect(res.status).toBe(200)
    const body = await res.json()

    expect(body.data).toEqual(rows)
    expect(body.stats.total_visits).toBe(3)
    expect(body.stats.forms_submitted).toBe(2)
    expect(body.stats.unique_sources).toContain('google')
    expect(body.stats.unique_sources).toContain('facebook')
    expect(body.stats.unique_sources).toHaveLength(2)
    expect(body.page).toBe(1)
    expect(body.limit).toBe(100)
  })

  it('applies date range filters when from/to are provided', async () => {
    const stub = queryStub({ data: [], count: 0, error: null })
    mockSupabaseFrom.mockReturnValue(stub)
    mockVerifyAdmin.mockResolvedValue({ error: null, supabase: mockAdminSupabase, userId: 'admin-1' } as any)

    await GET(makeRequest('http://localhost/api/admin/analytics?from=2026-01-01&to=2026-01-31'))
    expect(stub.gte).toHaveBeenCalledWith('created_at', '2026-01-01')
    expect(stub.lte).toHaveBeenCalledWith('created_at', '2026-01-31')
  })

  it('does not apply date filters when not provided', async () => {
    const stub = queryStub({ data: [], count: 0, error: null })
    mockSupabaseFrom.mockReturnValue(stub)
    mockVerifyAdmin.mockResolvedValue({ error: null, supabase: mockAdminSupabase, userId: 'admin-1' } as any)

    await GET(makeRequest('http://localhost/api/admin/analytics'))
    expect(stub.gte).not.toHaveBeenCalled()
    expect(stub.lte).not.toHaveBeenCalled()
  })

  it('caps limit at 200', async () => {
    const stub = queryStub({ data: [], count: 0, error: null })
    mockSupabaseFrom.mockReturnValue(stub)
    mockVerifyAdmin.mockResolvedValue({ error: null, supabase: mockAdminSupabase, userId: 'admin-1' } as any)

    const res = await GET(makeRequest('http://localhost/api/admin/analytics?limit=999'))
    const body = await res.json()
    expect(body.limit).toBe(200)
  })

  it('returns 500 on database error', async () => {
    const stub = queryStub({ data: null, count: null, error: { message: 'DB fail' } })
    mockSupabaseFrom.mockReturnValue(stub)
    mockVerifyAdmin.mockResolvedValue({ error: null, supabase: mockAdminSupabase, userId: 'admin-1' } as any)

    const res = await GET(makeRequest('http://localhost/api/admin/analytics'))
    expect(res.status).toBe(500)
    const body = await res.json()
    expect(body.error).toBe('Database error')
  })

  it('computes conversion_rate=0 when total_visits is 0', async () => {
    const stub = queryStub({ data: [], count: 0, error: null })
    mockSupabaseFrom.mockReturnValue(stub)
    mockVerifyAdmin.mockResolvedValue({ error: null, supabase: mockAdminSupabase, userId: 'admin-1' } as any)

    const res = await GET(makeRequest('http://localhost/api/admin/analytics'))
    const body = await res.json()
    expect(body.stats.conversion_rate).toBe(0)
  })
})
