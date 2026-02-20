/**
 * Integration tests for GET /api/admin/leads/[id]
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
import { GET } from '@/app/api/admin/leads/[id]/route'

const mockVerifyAdmin = verifyAdmin as jest.MockedFunction<typeof verifyAdmin>

function makeQuerySingle(result: object) {
  return {
    select: jest.fn().mockReturnThis(),
    eq: jest.fn().mockReturnThis(),
    single: jest.fn().mockResolvedValue(result),
  }
}

function makeRequest(url: string): NextRequest {
  return new NextRequest(url)
}

describe('GET /api/admin/leads/[id]', () => {
  beforeEach(() => {
    jest.clearAllMocks()
  })

  it('returns 401 when not authenticated', async () => {
    mockVerifyAdmin.mockResolvedValue({ error: 'Unauthorized', status: 401 } as any)
    const res = await GET(makeRequest('http://localhost/api/admin/leads/abc'), {
      params: Promise.resolve({ id: 'abc' }),
    })
    expect(res.status).toBe(401)
  })

  it('returns 403 when not admin', async () => {
    mockVerifyAdmin.mockResolvedValue({ error: 'Forbidden', status: 403 } as any)
    const res = await GET(makeRequest('http://localhost/api/admin/leads/abc'), {
      params: Promise.resolve({ id: 'abc' }),
    })
    expect(res.status).toBe(403)
  })

  it('returns the lead data for a valid id', async () => {
    const lead = { id: 'abc', name: 'Juan', status: 'new' }
    const stub = makeQuerySingle({ data: lead, error: null })
    mockSupabaseFrom.mockReturnValue(stub)
    mockVerifyAdmin.mockResolvedValue({ error: null, supabase: mockAdminSupabase, userId: 'admin-1' } as any)

    const res = await GET(makeRequest('http://localhost/api/admin/leads/abc'), {
      params: Promise.resolve({ id: 'abc' }),
    })
    expect(res.status).toBe(200)
    const body = await res.json()
    expect(body.data).toEqual(lead)
    expect(stub.eq).toHaveBeenCalledWith('id', 'abc')
  })

  it('returns 404 when lead is not found', async () => {
    const stub = makeQuerySingle({ data: null, error: { message: 'No rows' } })
    mockSupabaseFrom.mockReturnValue(stub)
    mockVerifyAdmin.mockResolvedValue({ error: null, supabase: mockAdminSupabase, userId: 'admin-1' } as any)

    const res = await GET(makeRequest('http://localhost/api/admin/leads/nonexistent'), {
      params: Promise.resolve({ id: 'nonexistent' }),
    })
    expect(res.status).toBe(404)
    const body = await res.json()
    expect(body.error).toBe('Not found')
  })

  it('returns 404 when data is null with no error', async () => {
    const stub = makeQuerySingle({ data: null, error: null })
    mockSupabaseFrom.mockReturnValue(stub)
    mockVerifyAdmin.mockResolvedValue({ error: null, supabase: mockAdminSupabase, userId: 'admin-1' } as any)

    const res = await GET(makeRequest('http://localhost/api/admin/leads/missing'), {
      params: Promise.resolve({ id: 'missing' }),
    })
    expect(res.status).toBe(404)
  })
})
