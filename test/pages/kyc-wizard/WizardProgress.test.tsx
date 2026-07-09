import { describe, it, expect } from 'vitest'
import { render, screen } from '@testing-library/react'
import WizardProgress from '../../../src/pages/kyc-wizard/WizardProgress'

describe('WizardProgress', () => {
  it('muestra todas las etiquetas de paso', () => {
    render(<WizardProgress currentStep={0} />)
    expect(screen.getByText('Datos')).toBeDefined()
    expect(screen.getByText('Documento')).toBeDefined()
    expect(screen.getByText('Selfie')).toBeDefined()
    expect(screen.getByText('Revisión')).toBeDefined()
  })

  it('resalta el paso actual', () => {
    render(<WizardProgress currentStep={0} />)
    const datos = screen.getByText('Datos')
    expect(datos.className).toContain('text-blue')
  })
})
