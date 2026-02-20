/**
 * Integration tests for GET /api/admin/stats
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
import { GET } from '@/app/api/admin/stats/route'

const mockVerifyAdmin = verifyAdmin as jest.MockedFunction<typeof verifyAdmin>

// Count-only query stub (head: true)
function countStub(count: number | null) {
  return {
    select: jest.fn().mockReturnThis(),
    eq: jest.fn().mockReturnThis(),
    gte: jest.fn().mockResolvedValue({ count, error: null }),
    // For terminal calls without gte/eq
    then: undefined,
  }
}

// We need to handle the 5 parallel queries. Each call to from() can return a
// different stub, so we track call order.
function setupCountStubs(counts: (number | null)[]) {
  let callIndex = 0
  mockSupabaseFrom.mockImplementation(() => {
    const c = counts[callIndex++] ?? 0
    const stub: any = {
      select: jest.fn().mockReturnThis(),
      eq: jest.fn().mockReturnThis(),
      gte: jest.fn().mockResolvedValue({ count: c, error: null }),
    }
    // Make the stub awaitable for queries that end in .select() with head:true
    // (i.e. Promise.resolve is needed after the chain)
    stub.select.mockImplementation(() => {
      const inner: any = {
        eq: jest.fn().mockResolvedValue({ count: c, error: null }),
        gte: jest.fn().mockResolvedValue({ count: c, error: null }),
        // when no further filter — resolve directly
        then: (resolve: any) => resolve({ count: c, error: null }),
        catch: jest.fn().mockReturnThis(),
        finally: jest.fn().mockReturnThis(),
      }
      return inner
    })
    return stub
  })
}

function makeRequest(url: string): NextRequest {
  return new NextRequest(url)
}

describe('GET /api/admin/stats', () => {
  beforeEach(() => {
    jest.clearAllMocks()
  })

  it('returns 401 when not authenticated', async () => {
    mockVerifyAdmin.mockResolvedValue({ error: 'Unauthorized', status: 401 } as any)
    const res = await GET(makeRequest('http://localhost/api/admin/stats'))
    expect(res.status).toBe(401)
  })

  it('returns 403 when not admin', async () => {
    mockVerifyAdmin.mockResolvedValue({ error: 'Forbidden', status: 403 } as any)
    const res = await GET(makeRequest('http://localhost/api/admin/stats'))
    expect(res.status).toBe(403)
  })

  it('returns aggregated stats with correct shape', async () => {
    // Counts for: leadsTotal, leadsNew, leadsThisWeek, visitsTotal, formsSubmitted
    setupCountStubs([100, 20, 10, 500, 25])
    mockVerifyAdmin.mockResolvedValue({ error: null, supabase: mockAdminSupabase, userId: 'admin-1' } as any)

    const res = await GET(makeRequest('http://localhost/api/admin/stats'))
    expect(res.status).toBe(200)
    const body = await res.json()

    expect(body).toHaveProperty('leads_total')
    expect(body).toHaveProperty('leads_new')
    expect(body).toHaveProperty('leads_this_week')
    expect(body).toHaveProperty('visits_total')
    expect(body).toHaveProperty('conversion_rate')
  })

  it('returns conversion_rate=0 when visits_total is 0', async () => {
    setupCountStubs([0, 0, 0, 0, 0])
    mockVerifyAdmin.mockResolvedValue({ error: null, supabase: mockAdminSupabase, userId: 'admin-1' } as any)

    const res = await GET(makeRequest('http://localhost/api/admin/stats'))
    const body = await res.json()
    expect(body.conversion_rate).toBe(0)
  })
})
