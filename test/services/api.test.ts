import { describe, it, expect, vi, beforeEach } from 'vitest'
import { createVerification, getVerification } from '../../src/services/api'

const mockFetch = vi.fn()
vi.stubGlobal('fetch', mockFetch)

beforeEach(() => {
  mockFetch.mockReset()
})

describe('api', () => {
  describe('createVerification', () => {
    it('envía POST multipart y devuelve respuesta exitosa', async () => {
      const responseData = {
        status: 'success',
        message: 'Verificación creada',
        data: { id: 'abc-123' },
        code: 201,
      }
      mockFetch.mockResolvedValue({
        ok: true,
        json: () => Promise.resolve(responseData),
      })

      const formData = new FormData()
      formData.append('name', 'Juan')

      const result = await createVerification(formData)
      expect(result.data?.id).toBe('abc-123')
      expect(mockFetch).toHaveBeenCalledTimes(1)

      const callUrl = mockFetch.mock.calls[0][0]
      expect(callUrl).toContain('/api/v1/verifications')

      const callOptions = mockFetch.mock.calls[0][1]
      expect(callOptions.method).toBe('POST')
      expect(callOptions.body).toBe(formData)
    })

    it('lanza error cuando la respuesta no es ok', async () => {
      mockFetch.mockResolvedValue({
        ok: false,
        status: 400,
        json: () => Promise.resolve({ message: 'Datos inválidos' }),
      })

      await expect(createVerification(new FormData())).rejects.toThrow(
        'Datos inválidos',
      )
    })

    it('lanza error de conexión cuando fetch falla', async () => {
      mockFetch.mockRejectedValue(new TypeError('Failed to fetch'))

      await expect(createVerification(new FormData())).rejects.toThrow(
        'Error de conexión',
      )
    })
  })

  describe('getVerification', () => {
    it('solicita GET al endpoint correcto', async () => {
      const responseData = {
        status: 'success',
        message: 'OK',
        data: {
          id: 'abc-123',
          name: 'Juan',
          email: 'juan@ejemplo.com',
          documentNumber: '123',
          urlDocumentImage: null,
          urlSelfieImage: null,
          status: 'pending',
          createdAt: '2024-01-01T00:00:00Z',
          updatedAt: '2024-01-01T00:00:00Z',
        },
        code: 200,
      }
      mockFetch.mockResolvedValue({
        ok: true,
        json: () => Promise.resolve(responseData),
      })

      const result = await getVerification('abc-123')
      expect(result.data?.status).toBe('pending')
      expect(mockFetch.mock.calls[0][0]).toContain('/api/v1/verifications/abc-123')
    })
  })

  describe('timeout', () => {
    it('lanza error cuando la solicitud excede el timeout', async () => {
      mockFetch.mockImplementation(
        () =>
          new Promise((_, reject) => {
            const error = new DOMException('The operation was aborted', 'AbortError')
            reject(error)
          }),
      )

      await expect(createVerification(new FormData())).rejects.toThrow(
        'tardó demasiado',
      )
    })
  })
})
