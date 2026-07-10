import { describe, it, expect, vi } from 'vitest'
import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import StepReview from '../../../src/pages/kyc-wizard/StepReview'

const defaultData = { name: 'Juan', email: 'juan@test.com', documentNumber: '12345678' }
const onBack = vi.fn()

describe('StepReview', () => {
  it('muestra los datos personales', () => {
    render(<StepReview data={defaultData} documentFile={null} selfieFile={null} isSubmitting={false} error={null} onSubmit={vi.fn()} onBack={onBack} />)
    expect(screen.getByText('Nombre')).toBeDefined()
    expect(screen.getByText('Juan')).toBeDefined()
    expect(screen.getByText('Correo')).toBeDefined()
    expect(screen.getByText('juan@test.com')).toBeDefined()
    expect(screen.getByText('Documento')).toBeDefined()
    expect(screen.getByText('12345678')).toBeDefined()
  })

  it('muestra "No subido" cuando faltan archivos', () => {
    render(<StepReview data={defaultData} documentFile={null} selfieFile={null} isSubmitting={false} error={null} onSubmit={vi.fn()} onBack={onBack} />)
    const matches = screen.getAllByText('No subido')
    expect(matches.length).toBeGreaterThanOrEqual(2)
  })

  it('muestra el nombre de los archivos cuando se subieron', () => {
    const doc = new File([''], 'dni.jpg', { type: 'image/jpeg' })
    const selfie = new File([''], 'selfie.jpg', { type: 'image/jpeg' })
    render(<StepReview data={defaultData} documentFile={doc} selfieFile={selfie} isSubmitting={false} error={null} onSubmit={vi.fn()} onBack={onBack} />)
    expect(screen.getByText('dni.jpg')).toBeDefined()
    expect(screen.getByText('selfie.jpg')).toBeDefined()
  })

  it('muestra error cuando hay error', () => {
    render(<StepReview data={defaultData} documentFile={null} selfieFile={null} isSubmitting={false} error={'Algo salio mal'} onSubmit={vi.fn()} onBack={onBack} />)
    expect(screen.getByRole('alert')).toHaveTextContent('Algo salio mal')
  })

  it('llama onSubmit al hacer clic en enviar', async () => {
    const user = userEvent.setup()
    const onSubmit = vi.fn()
    render(<StepReview data={defaultData} documentFile={null} selfieFile={null} isSubmitting={false} error={null} onSubmit={onSubmit} onBack={onBack} />)
    await user.click(screen.getByText('Enviar verificación'))
    expect(onSubmit).toHaveBeenCalledOnce()
  })

  it('deshabilita el boton cuando esta enviando', () => {
    render(<StepReview data={defaultData} documentFile={null} selfieFile={null} isSubmitting={true} error={null} onSubmit={vi.fn()} onBack={onBack} />)
    expect(screen.getByText('Enviando...')).toBeDisabled()
  })
})
