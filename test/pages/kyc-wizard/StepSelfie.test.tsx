import { describe, it, expect, vi } from 'vitest'
import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import StepSelfie from '../../../src/pages/kyc-wizard/StepSelfie'

describe('StepSelfie', () => {
  it('renderiza el texto de instruccion', () => {
    render(<StepSelfie file={null} onChange={vi.fn()} />)
    expect(screen.getByText(/selfie sosteniendo tu documento/i)).toBeDefined()
  })

  it('renderiza FileUpload sin preview cuando no hay archivo', () => {
    render(<StepSelfie file={null} onChange={vi.fn()} />)
    expect(screen.getByText(/arrastra o haz clic/i)).toBeDefined()
  })

  it('llama onChange al seleccionar un archivo', async () => {
    const user = userEvent.setup()
    const onChange = vi.fn()
    const { container } = render(<StepSelfie file={null} onChange={onChange} />)

    const file = new File([''], 'selfie.png', { type: 'image/png' })
    const input = container.querySelector('input[type="file"]')!
    await user.upload(input, file)

    expect(onChange).toHaveBeenCalledWith(file)
  })
})
