import { API_BASE_URL } from '../config/env'
import type { ApiResponse, Verification } from '../types'

class ApiError extends Error {
  code: number

  constructor(message: string, code: number) {
    super(message)
    this.name = 'ApiError'
    this.code = code
  }
}

async function apiFetch<T>(
  endpoint: string,
  options: RequestInit = {},
): Promise<ApiResponse<T>> {
  const url = `${API_BASE_URL}${endpoint}`
  const controller = new AbortController()
  const timeoutId = setTimeout(() => controller.abort(), 15000)

  try {
    const response = await fetch(url, {
      ...options,
      signal: controller.signal,
      headers: {
        Accept: 'application/json',
        ...options.headers,
      },
    })

    clearTimeout(timeoutId)

    if (!response.ok) {
      const errorBody = await response.json().catch(() => null)
      const message =
        errorBody?.message ?? `Error HTTP ${response.status}`
      throw new ApiError(message, response.status)
    }

    const json: ApiResponse<T> = await response.json()
    return json
  } catch (error) {
    clearTimeout(timeoutId)

    if (error instanceof ApiError) throw error

    if (error instanceof DOMException && error.name === 'AbortError') {
      throw new ApiError('La solicitud tardó demasiado. Intenta de nuevo.', 408)
    }

    if (error instanceof TypeError) {
      throw new ApiError(
        'Error de conexión. Verifica tu internet e intenta de nuevo.',
        0,
      )
    }

    throw new ApiError('Ocurrió un error inesperado.', 0)
  }
}

export function createVerification(
  formData: FormData,
): Promise<ApiResponse<{ id: string }>> {
  return apiFetch<{ id: string }>('/api/v1/verifications', {
    method: 'POST',
    body: formData,
  })
}

export function getVerification(
  id: string,
): Promise<ApiResponse<Verification>> {
  return apiFetch<Verification>(`/api/v1/verifications/${id}`)
}
