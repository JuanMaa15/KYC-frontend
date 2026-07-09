import { describe, it, expect, vi, beforeEach } from 'vitest'
import { renderHook, act } from '@testing-library/react'
import { useKycWizard } from '../../../src/pages/kyc-wizard/useKycWizard'

const mockCreateVerification = vi.fn()

vi.mock('../../../src/services/api', () => ({
  createVerification: (...args: unknown[]) => mockCreateVerification(...args),
}))

describe('useKycWizard', () => {
  beforeEach(() => {
    mockCreateVerification.mockReset()
  })

  it('inicializa en paso 0 con datos vacíos', () => {
    const { result } = renderHook(() => useKycWizard())
    expect(result.current.currentStep).toBe(0)
    expect(result.current.personalData).toEqual({
      name: '',
      email: '',
      documentNumber: '',
    })
    expect(result.current.documentFile).toBeNull()
    expect(result.current.selfieFile).toBeNull()
  })

  it('no permite avanzar en paso 0 con datos inválidos', () => {
    const { result } = renderHook(() => useKycWizard())
    expect(result.current.canProceed()).toBe(false)
  })

  it('permite avanzar en paso 0 con datos válidos', () => {
    const { result } = renderHook(() => useKycWizard())
    act(() => {
      result.current.setPersonalData({
        name: 'Juan Pérez',
        email: 'juan@ejemplo.com',
        documentNumber: '12345678',
      })
    })
    expect(result.current.canProceed()).toBe(true)
  })

  it('setPersonalData actualiza personalErrors con datos inválidos', () => {
    const { result } = renderHook(() => useKycWizard())
    act(() => {
      result.current.setPersonalData({
        name: 'J',
        email: 'invalido',
        documentNumber: '12',
      })
    })
    expect(result.current.personalErrors.name).toBeDefined()
    expect(result.current.personalErrors.email).toBeDefined()
    expect(result.current.personalErrors.documentNumber).toBeDefined()
  })

  it('nextStep avanza al paso siguiente si es posible', () => {
    const { result } = renderHook(() => useKycWizard())
    act(() => { result.current.nextStep() })
    expect(result.current.currentStep).toBe(1)
  })

  it('prevStep retrocede al paso anterior', () => {
    const { result } = renderHook(() => useKycWizard())
    act(() => { result.current.nextStep() })
    act(() => { result.current.prevStep() })
    expect(result.current.currentStep).toBe(0)
  })

  it('no retrocede antes del paso 0', () => {
    const { result } = renderHook(() => useKycWizard())
    act(() => { result.current.prevStep() })
    expect(result.current.currentStep).toBe(0)
  })

  it('setDocumentFile actualiza documentFile', () => {
    const { result } = renderHook(() => useKycWizard())
    const file = new File([''], 'doc.png', { type: 'image/png' })
    act(() => { result.current.setDocumentFile(file) })
    expect(result.current.documentFile).toBe(file)
  })

  it('setSelfieFile actualiza selfieFile', () => {
    const { result } = renderHook(() => useKycWizard())
    const file = new File([''], 'selfie.png', { type: 'image/png' })
    act(() => { result.current.setSelfieFile(file) })
    expect(result.current.selfieFile).toBe(file)
  })

  it('canProceed paso 1 requiere documentFile', () => {
    const { result } = renderHook(() => useKycWizard())
    act(() => { result.current.goToStep(1) })
    expect(result.current.canProceed()).toBe(false)
    const file = new File([''], 'doc.png', { type: 'image/png' })
    act(() => { result.current.setDocumentFile(file) })
    expect(result.current.canProceed()).toBe(true)
  })

  it('canProceed paso 2 requiere selfieFile', () => {
    const { result } = renderHook(() => useKycWizard())
    act(() => { result.current.goToStep(2) })
    expect(result.current.canProceed()).toBe(false)
    const file = new File([''], 'selfie.png', { type: 'image/png' })
    act(() => { result.current.setSelfieFile(file) })
    expect(result.current.canProceed()).toBe(true)
  })

  it('submit exitoso devuelve id y actualiza verificationId', async () => {
    mockCreateVerification.mockResolvedValue({
      status: 'success',
      message: 'Creado',
      data: { id: 'abc-123' },
      code: 201,
    })

    const { result } = renderHook(() => useKycWizard())
    act(() => {
      result.current.setPersonalData({
        name: 'Juan Pérez',
        email: 'juan@ejemplo.com',
        documentNumber: '12345678',
      })
    })
    const file = new File([''], 'doc.png', { type: 'image/png' })
    act(() => { result.current.setDocumentFile(file) })
    act(() => { result.current.setSelfieFile(file) })

    let id: string | null = null
    await act(async () => { id = await result.current.submit() })
    expect(id).toBe('abc-123')
    expect(result.current.verificationId).toBe('abc-123')
    expect(result.current.isSubmitting).toBe(false)
  })

  it('submit con error captura el mensaje', async () => {
    mockCreateVerification.mockRejectedValue(new Error('Error de red'))

    const { result } = renderHook(() => useKycWizard())
    act(() => {
      result.current.setPersonalData({
        name: 'Juan Pérez',
        email: 'juan@ejemplo.com',
        documentNumber: '12345678',
      })
    })

    await act(async () => { await result.current.submit() })
    expect(result.current.error).toBe('Error de red')
    expect(result.current.isSubmitting).toBe(false)
  })

  it('reset vuelve al estado inicial', () => {
    const { result } = renderHook(() => useKycWizard())
    act(() => { result.current.nextStep() })
    act(() => {
      result.current.setPersonalData({
        name: 'Juan Pérez',
        email: 'juan@ejemplo.com',
        documentNumber: '12345678',
      })
    })
    act(() => { result.current.reset() })
    expect(result.current.currentStep).toBe(0)
    expect(result.current.personalData.name).toBe('')
    expect(result.current.verificationId).toBeNull()
  })
})
