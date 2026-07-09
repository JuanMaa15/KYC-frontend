import { useState, useCallback } from 'react'
import { z } from 'zod'
import { createVerification } from '../../services/api'

const personalDataSchema = z.object({
  name: z.string().min(2, 'El nombre debe tener al menos 2 caracteres'),
  email: z.string().email('Correo electrónico inválido'),
  documentNumber: z
    .string()
    .min(5, 'El documento debe tener al menos 5 caracteres'),
})

export type PersonalData = z.infer<typeof personalDataSchema>
export type Step = 0 | 1 | 2 | 3

export interface WizardState {
  currentStep: Step
  personalData: PersonalData
  personalErrors: Partial<Record<keyof PersonalData, string>>
  documentFile: File | null
  selfieFile: File | null
  isSubmitting: boolean
  error: string | null
  verificationId: string | null
}

const initialState: WizardState = {
  currentStep: 0,
  personalData: { name: '', email: '', documentNumber: '' },
  personalErrors: {},
  documentFile: null,
  selfieFile: null,
  isSubmitting: false,
  error: null,
  verificationId: null,
}

export function useKycWizard() {
  const [state, setState] = useState<WizardState>(initialState)

  const setPersonalData = useCallback(
    (data: PersonalData) => {
      const result = personalDataSchema.safeParse(data)
      if (result.success) {
        setState((prev) => ({
          ...prev,
          personalData: data,
          personalErrors: {},
        }))
      } else {
        const fieldErrors = result.error.flatten().fieldErrors as Record<
          string,
          string[] | undefined
        >
        setState((prev) => ({
          ...prev,
          personalData: data,
          personalErrors: {
            name: fieldErrors.name?.[0],
            email: fieldErrors.email?.[0],
            documentNumber: fieldErrors.documentNumber?.[0],
          },
        }))
      }
    },
    [],
  )

  const setDocumentFile = useCallback((file: File | null) => {
    setState((prev) => ({ ...prev, documentFile: file }))
  }, [])

  const setSelfieFile = useCallback((file: File | null) => {
    setState((prev) => ({ ...prev, selfieFile: file }))
  }, [])

  const canProceed = useCallback((): boolean => {
    const { currentStep, personalData, documentFile, selfieFile } = state
    switch (currentStep) {
      case 0:
        return personalDataSchema.safeParse(personalData).success
      case 1:
        return documentFile !== null
      case 2:
        return selfieFile !== null
      case 3:
        return true
    }
  }, [state])

  const goToStep = useCallback((step: Step) => {
    setState((prev) => ({ ...prev, currentStep: step }))
  }, [])

  const nextStep = useCallback(() => {
    setState((prev) => {
      const next = (prev.currentStep + 1) as Step
      if (next > 3) return prev
      return { ...prev, currentStep: next }
    })
  }, [])

  const prevStep = useCallback(() => {
    setState((prev) => {
      const prevStep = (prev.currentStep - 1) as Step
      if (prevStep < 0) return prev
      return { ...prev, currentStep: prevStep }
    })
  }, [])

  const submit = useCallback(async () => {
    setState((prev) => ({ ...prev, isSubmitting: true, error: null }))

    try {
      const formData = new FormData()
      formData.append('name', state.personalData.name)
      formData.append('email', state.personalData.email)
      formData.append('documentNumber', state.personalData.documentNumber)
      if (state.documentFile) {
        formData.append('documentImage', state.documentFile)
      }
      if (state.selfieFile) {
        formData.append('selfieImage', state.selfieFile)
      }

      const response = await createVerification(formData)
      const id = response.data!.id
      setState((prev) => ({
        ...prev,
        isSubmitting: false,
        verificationId: id,
      }))
      return id
    } catch (err) {
      const message =
        err instanceof Error ? err.message : 'Error al enviar los datos.'
      setState((prev) => ({ ...prev, isSubmitting: false, error: message }))
      return null
    }
  }, [state.personalData, state.documentFile, state.selfieFile])

  const reset = useCallback(() => {
    setState(initialState)
  }, [])

  return {
    ...state,
    setPersonalData,
    setDocumentFile,
    setSelfieFile,
    canProceed,
    goToStep,
    nextStep,
    prevStep,
    submit,
    reset,
  }
}
