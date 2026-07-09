import { describe, it, expect, vi } from 'vitest'
import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import App from '../src/App'

vi.mock('../src/hooks/usePolling', () => ({
  usePolling: vi.fn().mockReturnValue({
    verification: { id: 'abc-123', status: 'approved' },
    isLoading: false,
    error: null,
    stopped: true,
  }),
}))

vi.mock('../src/pages/kyc-wizard/KycWizardPage', () => ({
  default: ({ onComplete }: { onComplete: (id: string) => void }) => (
    <button onClick={() => onComplete('abc-123')}>Mock Wizard</button>
  ),
}))

describe('App', () => {
  it('renderiza el wizard inicialmente', () => {
    render(<App />)
    expect(screen.getByText('Mock Wizard')).toBeDefined()
  })

  it('navega a status cuando el wizard completa', async () => {
    const user = userEvent.setup()
    render(<App />)

    await user.click(screen.getByText('Mock Wizard'))
    expect(screen.getAllByText('Aprobado')).toHaveLength(2)
  })
})
