import { describe, it, expect, vi } from 'vitest'
import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import KycWizardPage from '../../../src/pages/kyc-wizard/KycWizardPage'

const mockUseKycWizard = vi.fn()

vi.mock('../../../src/pages/kyc-wizard/useKycWizard', () => ({
  useKycWizard: () => mockUseKycWizard(),
}))

function buildMock(overrides: Record<string, unknown> = {}) {
  return {
    currentStep: 0,
    personalData: { name: '', email: '', documentNumber: '' },
    personalErrors: {},
    documentFile: null,
    selfieFile: null,
    isSubmitting: false,
    error: null,
    verificationId: null,
    setPersonalData: vi.fn(),
    setDocumentFile: vi.fn(),
    setSelfieFile: vi.fn(),
    canProceed: vi.fn().mockReturnValue(false),
    nextStep: vi.fn(),
    prevStep: vi.fn(),
    goToStep: vi.fn(),
    submit: vi.fn(),
    reset: vi.fn(),
    ...overrides,
  }
}

describe('KycWizardPage', () => {
  it('renderiza el paso 0 (StepPersonalData) por defecto', () => {
    mockUseKycWizard.mockReturnValue(buildMock())
    render(<KycWizardPage onComplete={vi.fn()} />)
    expect(screen.getByLabelText('Nombre completo')).toBeDefined()
  })

  it('muestra boton Siguiente en paso 0', () => {
    mockUseKycWizard.mockReturnValue(buildMock())
    render(<KycWizardPage onComplete={vi.fn()} />)
    expect(screen.getByText('Siguiente')).toBeDefined()
  })

  it('no muestra boton Atras en paso 0', () => {
    mockUseKycWizard.mockReturnValue(buildMock({ currentStep: 0 }))
    render(<KycWizardPage onComplete={vi.fn()} />)
    expect(screen.getByText('Atrás')).toBeDisabled()
  })

  it('llama nextStep al hacer clic en Siguiente', async () => {
    const user = userEvent.setup()
    const nextStep = vi.fn()
    mockUseKycWizard.mockReturnValue(buildMock({ canProceed: vi.fn().mockReturnValue(true), nextStep }))
    render(<KycWizardPage onComplete={vi.fn()} />)
    await user.click(screen.getByText('Siguiente'))
    expect(nextStep).toHaveBeenCalledOnce()
  })

  it('renderiza StepDocumentPhoto en paso 1', () => {
    mockUseKycWizard.mockReturnValue(buildMock({ currentStep: 1 }))
    render(<KycWizardPage onComplete={vi.fn()} />)
    expect(screen.getByText(/foto legible de tu documento/i)).toBeDefined()
  })

  it('renderiza StepSelfie en paso 2', () => {
    mockUseKycWizard.mockReturnValue(buildMock({ currentStep: 2 }))
    render(<KycWizardPage onComplete={vi.fn()} />)
    expect(screen.getByText(/selfie sosteniendo tu documento/i)).toBeDefined()
  })

  it('renderiza StepReview en paso 3 sin botones de navegacion', () => {
    mockUseKycWizard.mockReturnValue(buildMock({ currentStep: 3 }))
    render(<KycWizardPage onComplete={vi.fn()} />)
    expect(screen.getByText('Enviar verificación')).toBeDefined()
    expect(screen.queryByText('Siguiente')).toBeNull()
  })

  it('llama onComplete cuando el submit es exitoso', async () => {
    const user = userEvent.setup()
    const onComplete = vi.fn()
    const submit = vi.fn().mockResolvedValue('verif-456')
    mockUseKycWizard.mockReturnValue(buildMock({ currentStep: 3, submit }))
    render(<KycWizardPage onComplete={onComplete} />)
    await user.click(screen.getByText('Enviar verificación'))
    expect(onComplete).toHaveBeenCalledWith('verif-456')
  })
})
