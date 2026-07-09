import { describe, it, expect, vi } from 'vitest'
import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import StepPersonalData from '../../../src/pages/kyc-wizard/StepPersonalData'

describe('StepPersonalData', () => {
  it('renderiza los 3 campos del formulario', () => {
    const onChange = vi.fn()
    render(
      <StepPersonalData
        data={{ name: '', email: '', documentNumber: '' }}
        errors={{}}
        onChange={onChange}
      />,
    )
    expect(screen.getByLabelText('Nombre completo')).toBeDefined()
    expect(screen.getByLabelText('Correo electrónico')).toBeDefined()
    expect(screen.getByLabelText('Número de documento')).toBeDefined()
  })

  it('llama onChange al escribir en un campo', async () => {
    const user = userEvent.setup()
    const onChange = vi.fn()
    render(
      <StepPersonalData
        data={{ name: '', email: '', documentNumber: '' }}
        errors={{}}
        onChange={onChange}
      />,
    )

    await user.type(screen.getByLabelText('Nombre completo'), 'J')
    expect(onChange).toHaveBeenCalled()
  })

  it('muestra errores de validación', () => {
    const onChange = vi.fn()
    render(
      <StepPersonalData
        data={{ name: 'J', email: '', documentNumber: '' }}
        errors={{ name: 'Muy corto' }}
        onChange={onChange}
      />,
    )
    expect(screen.getByText('Muy corto')).toBeDefined()
  })
})
