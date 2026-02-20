import React from 'react'
import { render, screen } from '@testing-library/react'
import '@testing-library/jest-dom'
import { StatsCard } from './stats-card'

describe('StatsCard', () => {
  it('renders title and numeric value', () => {
    render(<StatsCard title="Total Leads" value={42} />)
    expect(screen.getByText('Total Leads')).toBeInTheDocument()
    expect(screen.getByText('42')).toBeInTheDocument()
  })

  it('renders title and string value', () => {
    render(<StatsCard title="Conversión" value="8.5%" />)
    expect(screen.getByText('Conversión')).toBeInTheDocument()
    expect(screen.getByText('8.5%')).toBeInTheDocument()
  })

  it('renders subtitle when provided', () => {
    render(<StatsCard title="Leads Nuevos" value={10} subtitle="Sin contactar" />)
    expect(screen.getByText('Sin contactar')).toBeInTheDocument()
  })

  it('does not render subtitle element when not provided', () => {
    render(<StatsCard title="Total" value={5} />)
    expect(screen.queryByText('Sin contactar')).not.toBeInTheDocument()
  })

  it('sets data-testid when testId is provided', () => {
    render(<StatsCard title="Semana" value={3} testId="stat-leads-week" />)
    expect(screen.getByTestId('stat-leads-week')).toBeInTheDocument()
  })

  it('renders zero value correctly', () => {
    render(<StatsCard title="Total" value={0} />)
    expect(screen.getByText('0')).toBeInTheDocument()
  })
})
