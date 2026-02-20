import React from 'react'
import { render, screen, fireEvent, waitFor } from '@testing-library/react'
import '@testing-library/jest-dom'
import { AdminHeader } from './admin-header'

const mockPush = jest.fn()
const mockSignOut = jest.fn().mockResolvedValue({})

jest.mock('next/navigation', () => ({
  useRouter: () => ({ push: mockPush }),
}))

jest.mock('@/lib/supabase/client', () => ({
  supabase: {
    auth: {
      signOut: () => mockSignOut(),
    },
  },
}))

describe('AdminHeader', () => {
  beforeEach(() => {
    jest.clearAllMocks()
  })

  it('renders the brand name', () => {
    render(<AdminHeader />)
    expect(screen.getByText('Boreas Admin')).toBeInTheDocument()
  })

  it('renders navigation links', () => {
    render(<AdminHeader />)
    expect(screen.getByText('Overview')).toBeInTheDocument()
    expect(screen.getByText('Leads')).toBeInTheDocument()
    expect(screen.getByText('Analytics')).toBeInTheDocument()
  })

  it('nav links point to correct hrefs', () => {
    render(<AdminHeader />)
    expect(screen.getByText('Overview').closest('a')).toHaveAttribute('href', '/admin/dashboard')
    expect(screen.getByText('Leads').closest('a')).toHaveAttribute('href', '/admin/dashboard/leads')
    expect(screen.getByText('Analytics').closest('a')).toHaveAttribute('href', '/admin/dashboard/analytics')
  })

  it('renders the sign-out button', () => {
    render(<AdminHeader />)
    expect(screen.getByRole('button', { name: /cerrar sesión/i })).toBeInTheDocument()
  })

  it('calls signOut and redirects to /admin/login on sign-out click', async () => {
    render(<AdminHeader />)
    const button = screen.getByRole('button', { name: /cerrar sesión/i })
    fireEvent.click(button)
    await waitFor(() => {
      expect(mockSignOut).toHaveBeenCalledTimes(1)
      expect(mockPush).toHaveBeenCalledWith('/admin/login')
    })
  })
})
