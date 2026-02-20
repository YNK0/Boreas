import React from 'react'
import { render, screen } from '@testing-library/react'
import '@testing-library/jest-dom'
import { StatusBadge } from './status-badge'

describe('StatusBadge', () => {
  const knownStatuses = [
    { status: 'new', label: 'Nuevo' },
    { status: 'contacted', label: 'Contactado' },
    { status: 'demo_scheduled', label: 'Demo agendada' },
    { status: 'demo_completed', label: 'Demo completada' },
    { status: 'proposal_sent', label: 'Propuesta enviada' },
    { status: 'won', label: 'Ganado' },
    { status: 'lost', label: 'Perdido' },
    { status: 'nurturing', label: 'Nurturing' },
  ]

  knownStatuses.forEach(({ status, label }) => {
    it(`renders "${label}" label for status "${status}"`, () => {
      render(<StatusBadge status={status} />)
      expect(screen.getByText(label)).toBeInTheDocument()
    })
  })

  it('falls back to the raw status string for unknown status', () => {
    render(<StatusBadge status="unknown_status" />)
    expect(screen.getByText('unknown_status')).toBeInTheDocument()
  })

  it('applies correct color class for "new" status', () => {
    render(<StatusBadge status="new" />)
    const badge = screen.getByText('Nuevo')
    expect(badge).toHaveClass('bg-blue-100', 'text-blue-800')
  })

  it('applies correct color class for "won" status', () => {
    render(<StatusBadge status="won" />)
    const badge = screen.getByText('Ganado')
    expect(badge).toHaveClass('bg-green-100', 'text-green-800')
  })

  it('applies correct color class for "lost" status', () => {
    render(<StatusBadge status="lost" />)
    const badge = screen.getByText('Perdido')
    expect(badge).toHaveClass('bg-red-100', 'text-red-800')
  })

  it('applies fallback gray class for unknown status', () => {
    render(<StatusBadge status="undefined_status" />)
    const badge = screen.getByText('undefined_status')
    expect(badge).toHaveClass('bg-gray-100', 'text-gray-800')
  })

  it('renders as a span element', () => {
    render(<StatusBadge status="new" />)
    const badge = screen.getByText('Nuevo')
    expect(badge.tagName.toLowerCase()).toBe('span')
  })
})
