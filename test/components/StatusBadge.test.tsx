import { describe, it, expect } from 'vitest'
import { render, screen } from '@testing-library/react'
import StatusBadge from '../../src/components/StatusBadge'

describe('StatusBadge', () => {
  it('muestra Pendiente para status pending', () => {
    render(<StatusBadge status="pending" />)
    expect(screen.getByText('Pendiente')).toBeDefined()
  })

  it('muestra Aprobado para status approved', () => {
    render(<StatusBadge status="approved" />)
    expect(screen.getByText('Aprobado')).toBeDefined()
  })

  it('muestra Rechazado para status rejected', () => {
    render(<StatusBadge status="rejected" />)
    expect(screen.getByText('Rechazado')).toBeDefined()
  })
})
