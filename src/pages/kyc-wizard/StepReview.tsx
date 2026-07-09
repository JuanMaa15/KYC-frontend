import Button from '../../components/Button'
import type { PersonalData } from './useKycWizard'

interface StepReviewProps {
  data: PersonalData
  documentFile: File | null
  selfieFile: File | null
  isSubmitting: boolean
  error: string | null
  onSubmit: () => void
}

export default function StepReview({
  data,
  documentFile,
  selfieFile,
  isSubmitting,
  error,
  onSubmit,
}: StepReviewProps) {
  return (
    <div className="flex flex-col gap-4">
      <div className="rounded-lg border border-gray-200 p-4 text-sm dark:border-gray-700">
        <h3 className="mb-2 font-semibold">Datos personales</h3>
        <p>Nombre: {data.name}</p>
        <p>Email: {data.email}</p>
        <p>Documento: {data.documentNumber}</p>
      </div>

      <div className="rounded-lg border border-gray-200 p-4 text-sm dark:border-gray-700">
        <h3 className="mb-2 font-semibold">Archivos</h3>
        <p>Documento: {documentFile?.name ?? 'No subido'}</p>
        <p>Selfie: {selfieFile?.name ?? 'No subido'}</p>
      </div>

      {error && (
        <p className="text-sm text-red-500" role="alert">
          {error}
        </p>
      )}

      <Button onClick={onSubmit} loading={isSubmitting} className="w-full">
        Enviar verificación
      </Button>
    </div>
  )
}
