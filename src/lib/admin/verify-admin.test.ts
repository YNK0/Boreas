import { verifyAdmin } from './verify-admin'

// Supabase client factory mock — set up per test via mockImplementation
const mockGetUser = jest.fn()
const mockFrom = jest.fn()

jest.mock('@/lib/supabase/server', () => ({
  createClient: jest.fn(() =>
    Promise.resolve({
      auth: { getUser: mockGetUser },
      from: mockFrom,
    })
  ),
}))

// Helper: build a chainable Supabase query mock
function makeQueryMock(resolvedData: unknown) {
  const chain = {
    select: jest.fn().mockReturnThis(),
    eq: jest.fn().mockReturnThis(),
    single: jest.fn().mockResolvedValue(resolvedData),
  }
  return chain
}

describe('verifyAdmin', () => {
  beforeEach(() => {
    jest.clearAllMocks()
  })

  it('returns 401 when there is no authenticated user', async () => {
    mockGetUser.mockResolvedValue({ data: { user: null } })

    const result = await verifyAdmin()

    expect(result.error).toBe('Unauthorized')
    expect(result.status).toBe(401)
  })

  it('returns 403 when the user does not have role=admin', async () => {
    mockGetUser.mockResolvedValue({ data: { user: { id: 'user-1' } } })
    mockFrom.mockReturnValue(makeQueryMock({ data: { role: 'user' }, error: null }))

    const result = await verifyAdmin()

    expect(result.error).toBe('Forbidden')
    expect(result.status).toBe(403)
  })

  it('returns 403 when the profile row is missing (null)', async () => {
    mockGetUser.mockResolvedValue({ data: { user: { id: 'user-1' } } })
    mockFrom.mockReturnValue(makeQueryMock({ data: null, error: null }))

    const result = await verifyAdmin()

    expect(result.error).toBe('Forbidden')
    expect(result.status).toBe(403)
  })

  it('returns success with supabase client and userId for admin user', async () => {
    mockGetUser.mockResolvedValue({ data: { user: { id: 'admin-1' } } })
    mockFrom.mockReturnValue(makeQueryMock({ data: { role: 'admin' }, error: null }))

    const result = await verifyAdmin()

    expect(result.error).toBeNull()
    if (result.error === null) {
      expect(result.userId).toBe('admin-1')
      expect(result.supabase).toBeDefined()
    }
  })

  it('queries the users table with the authenticated user id', async () => {
    const userId = 'user-abc'
    mockGetUser.mockResolvedValue({ data: { user: { id: userId } } })
    const queryMock = makeQueryMock({ data: { role: 'admin' }, error: null })
    mockFrom.mockReturnValue(queryMock)

    await verifyAdmin()

    expect(mockFrom).toHaveBeenCalledWith('users')
    expect(queryMock.select).toHaveBeenCalledWith('role')
    expect(queryMock.eq).toHaveBeenCalledWith('id', userId)
  })

  it('returns 503 when database query fails with error', async () => {
    mockGetUser.mockResolvedValue({ data: { user: { id: 'user-1' } } })
    const queryError = new Error('Database connection failed')
    mockFrom.mockReturnValue(makeQueryMock({ data: null, error: queryError }))

    const result = await verifyAdmin()

    expect(result.error).toBe('Service Unavailable')
    expect(result.status).toBe(503)
  })

  it('returns 503 when Supabase throws database errors', async () => {
    mockGetUser.mockResolvedValue({ data: { user: { id: 'user-2' } } })
    const dbError = { message: 'Connection timeout', code: 'PGRST301' }
    mockFrom.mockReturnValue(makeQueryMock({ data: null, error: dbError }))

    const result = await verifyAdmin()

    expect(result.error).toBe('Service Unavailable')
    expect(result.status).toBe(503)
  })

  it('accepts an optional NextRequest parameter without errors', async () => {
    mockGetUser.mockResolvedValue({ data: { user: { id: 'admin-1' } } })
    mockFrom.mockReturnValue(makeQueryMock({ data: { role: 'admin' }, error: null }))

    const fakeRequest = {} as any
    const result = await verifyAdmin(fakeRequest)

    expect(result.error).toBeNull()
  })
})
