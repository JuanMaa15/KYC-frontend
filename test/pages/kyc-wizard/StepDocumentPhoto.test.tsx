import { describe, it, expect, vi } from 'vitest'
import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import StepDocumentPhoto from '../../../src/pages/kyc-wizard/StepDocumentPhoto'

describe('StepDocumentPhoto', () => {
  it('renderiza el texto de instruccion', () => {
    render(<StepDocumentPhoto file={null} onChange={vi.fn()} />)
    expect(screen.getByText(/foto legible de tu documento/i)).toBeDefined()
  })

  it('renderiza FileUpload sin preview cuando no hay archivo', () => {
    render(<StepDocumentPhoto file={null} onChange={vi.fn()} />)
    expect(screen.getByText(/arrastra o haz clic/i)).toBeDefined()
  })

  it('llama onChange al seleccionar un archivo', async () => {
    const user = userEvent.setup()
    const onChange = vi.fn()
    const { container } = render(<StepDocumentPhoto file={null} onChange={onChange} />)

    const file = new File([''], 'doc.png', { type: 'image/png' })
    const input = container.querySelector('input[type="file"]')!
    await user.upload(input, file)

    expect(onChange).toHaveBeenCalledWith(file)
  })
})
