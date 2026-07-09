import { describe, it, expect } from 'vitest'
import { render } from '@testing-library/react'
import Spinner from '../../src/components/Spinner'

describe('Spinner', () => {
  it('renderiza con tamaño md por defecto', () => {
    const { container } = render(<Spinner />)
    const svg = container.querySelector('svg')
    expect(svg).toBeDefined()
    expect(svg!.getAttribute('class')).toContain('h-6')
  })

  it('renderiza con tamaño sm', () => {
    const { container } = render(<Spinner size="sm" />)
    const svg = container.querySelector('svg')
    expect(svg!.getAttribute('class')).toContain('h-4')
  })

  it('renderiza con tamaño lg', () => {
    const { container } = render(<Spinner size="lg" />)
    const svg = container.querySelector('svg')
    expect(svg!.getAttribute('class')).toContain('h-10')
  })

  it('tiene aria-label de carga', () => {
    const { container } = render(<Spinner />)
    const svg = container.querySelector('svg')
    expect(svg!.getAttribute('aria-label')).toBe('Cargando...')
  })

  it('aplica className adicional', () => {
    const { container } = render(<Spinner className="text-red-500" />)
    const svg = container.querySelector('svg')
    expect(svg!.getAttribute('class')).toContain('text-red-500')
  })
})
