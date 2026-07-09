export type VerificationStatus = 'pending' | 'approved' | 'rejected'

export interface Verification {
  id: string
  name: string
  email: string
  documentNumber: string
  urlDocumentImage: string | null
  urlSelfieImage: string | null
  status: VerificationStatus
  createdAt: string
  updatedAt: string
}

export interface ApiResponse<T = unknown> {
  status: 'success' | 'error'
  message: string
  data?: T
  code: number
}
