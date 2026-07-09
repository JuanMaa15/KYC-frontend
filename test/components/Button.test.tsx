import { describe, it, expect } from 'vitest'
import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import Button from '../../src/components/Button'

describe('Button', () => {
  it('renderiza el texto del children', () => {
    render(<Button>Enviar</Button>)
    expect(screen.getByRole('button', { name: 'Enviar' })).toBeDefined()
  })

  it('aplica variant primary por defecto', () => {
    render(<Button>Click</Button>)
    const button = screen.getByRole('button')
    expect(button.className).toContain('bg-blue-600')
  })

  it('aplica variant secondary', () => {
    render(<Button variant="secondary">Click</Button>)
    const button = screen.getByRole('button')
    expect(button.className).toContain('border')
  })

  it('aplica variant ghost', () => {
    render(<Button variant="ghost">Click</Button>)
    const button = screen.getByRole('button')
    expect(button.className).toContain('hover:bg-gray-100')
  })

  it('deshabilita el botón cuando loading es true', () => {
    render(<Button loading>Enviar</Button>)
    const button = screen.getByRole('button')
    expect(button).toBeDisabled()
  })

  it('muestra spinner cuando loading es true', () => {
    render(<Button loading>Enviar</Button>)
    const spinner = document.querySelector('svg.animate-spin')
    expect(spinner).toBeDefined()
  })

  it('deshabilita con prop disabled', () => {
    render(<Button disabled>No tocar</Button>)
    expect(screen.getByRole('button')).toBeDisabled()
  })

  it('lanza onClick al hacer clic', async () => {
    const user = userEvent.setup()
    let clicked = false
    render(<Button onClick={() => { clicked = true }}>Click</Button>)
    await user.click(screen.getByRole('button'))
    expect(clicked).toBe(true)
  })
})
