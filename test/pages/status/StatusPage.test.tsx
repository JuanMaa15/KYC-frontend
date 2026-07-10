import { describe, it, expect, vi } from 'vitest'
import { render, screen } from '@testing-library/react'
import StatusPage from '../../../src/pages/status/StatusPage'

vi.mock('../../../src/hooks/usePolling', () => ({
  usePolling: vi.fn(),
}))

import { usePolling } from '../../../src/hooks/usePolling'
const mockUsePolling = usePolling as ReturnType<typeof vi.fn>

describe('StatusPage', () => {
  it('muestra spinner mientras carga', () => {
    mockUsePolling.mockReturnValue({
      verification: null, isLoading: true, error: null, stopped: false,
    })
    render(<StatusPage verificationId="abc-123" />)
    expect(screen.getAllByText(/Verificando tu identidad/i).length).toBeGreaterThanOrEqual(1)
  })

  it('muestra aprobado cuando status es approved', () => {
    mockUsePolling.mockReturnValue({
      verification: { status: 'approved' }, isLoading: false, error: null, stopped: true,
    })
    render(<StatusPage verificationId="abc-123" />)
    expect(screen.getAllByText('Aprobado')).toHaveLength(2)
  })

  it('muestra rechazado cuando status es rejected', () => {
    mockUsePolling.mockReturnValue({
      verification: { status: 'rejected' }, isLoading: false, error: null, stopped: true,
    })
    render(<StatusPage verificationId="abc-123" />)
    expect(screen.getAllByText('Rechazado')).toHaveLength(2)
  })

  it('muestra error cuando hay error', () => {
    mockUsePolling.mockReturnValue({
      verification: null, isLoading: false, error: 'Algo salio mal', stopped: true,
    })
    render(<StatusPage verificationId="abc-123" />)
    expect(screen.getByRole('alert')).toHaveTextContent('Algo salio mal')
  })
})
