import { describe, it, expect, vi, afterEach } from 'vitest'
import { renderHook, waitFor } from '@testing-library/react'
import { usePolling } from '../../src/hooks/usePolling'

const mockGetVerification = vi.fn()

vi.mock('../../src/services/api', () => ({
  getVerification: (...args: unknown[]) => mockGetVerification(...args),
}))

afterEach(() => {
  mockGetVerification.mockReset()
})

describe('usePolling', () => {
  it('inicia con isLoading true', () => {
    mockGetVerification.mockResolvedValue({
      status: 'success', message: '', data: { status: 'pending' }, code: 200,
    })
    const { result } = renderHook(() => usePolling('abc-123'))
    expect(result.current.isLoading).toBe(true)
  })

  it('retorna verification cuando la API responde con veredicto', async () => {
    mockGetVerification.mockResolvedValue({
      status: 'success', message: '', data: { id: 'abc', status: 'approved' }, code: 200,
    })
    const { result } = renderHook(() => usePolling('abc-123'))
    await waitFor(() => expect(result.current.verification?.status).toBe('approved'))
    expect(result.current.isLoading).toBe(false)
    expect(result.current.stopped).toBe(true)
  })

  it('setea error cuando la API falla', async () => {
    mockGetVerification.mockRejectedValue(new Error('Error de conexion'))
    const { result } = renderHook(() => usePolling('abc-123'))
    await waitFor(() => expect(result.current.error).toBe('Error de conexion'))
    expect(result.current.isLoading).toBe(false)
  })

  it('no hace polling con verificationId null', () => {
    const { result } = renderHook(() => usePolling(null))
    expect(result.current.verification).toBeNull()
    expect(mockGetVerification).not.toHaveBeenCalled()
  })
})
