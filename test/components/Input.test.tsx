import { describe, it, expect } from 'vitest'
import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import Input from '../../src/components/Input'

describe('Input', () => {
  it('renderiza input con label', () => {
    render(<Input label="Nombre" />)
    expect(screen.getByLabelText('Nombre')).toBeDefined()
  })

  it('muestra mensaje de error', () => {
    render(<Input label="Email" error="Correo inválido" />)
    expect(screen.getByRole('alert')).toHaveTextContent('Correo inválido')
  })

  it('marca aria-invalid cuando hay error', () => {
    render(<Input label="Email" error="Error" />)
    expect(screen.getByLabelText('Email')).toHaveAttribute('aria-invalid', 'true')
  })

  it('aplica className adicional', () => {
    render(<Input className="extra-clase" />)
    const input = screen.getByRole('textbox')
    expect(input.className).toContain('extra-clase')
  })

  it('permite escribir texto', async () => {
    const user = userEvent.setup()
    render(<Input label="Nombre" />)
    const input = screen.getByLabelText('Nombre')
    await user.type(input, 'Juan')
    expect(input).toHaveValue('Juan')
  })

  it('renderiza sin label', () => {
    render(<Input placeholder="Sin label" />)
    expect(screen.getByPlaceholderText('Sin label')).toBeDefined()
  })
})
