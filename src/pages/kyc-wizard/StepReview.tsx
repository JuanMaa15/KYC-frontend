import { useMemo } from 'react'
import Button from '../../components/Button'
import type { PersonalData } from './useKycWizard'

interface FileThumbnailProps {
  file: File | null
  name: string
}

function FileThumbnail({ file, name }: FileThumbnailProps) {
  const blobUrl = useMemo(() => {
    if (!file) return null
    return URL.createObjectURL(file)
  }, [file])

  return (
    <div className="border border-slate-200 rounded-lg p-2">
      {blobUrl ? (
        <img
          src={blobUrl}
          alt={name}
          className="h-32 w-full object-contain"
        />
      ) : (
        <div className="flex h-32 items-center justify-center rounded border border-dashed border-slate-200">
          <span className="text-xs text-slate-400">No subido</span>
        </div>
      )}
      <p className="mt-1 truncate text-center text-xs text-slate-400">
        {file?.name ?? 'No subido'}
      </p>
    </div>
  )
}

interface StepReviewProps {
  data: PersonalData
  documentFile: File | null
  selfieFile: File | null
  isSubmitting: boolean
  error: string | null
  onSubmit: () => void
  onBack: () => void
}

export default function StepReview({
  data,
  documentFile,
  selfieFile,
  isSubmitting,
  error,
  onSubmit,
  onBack,
}: StepReviewProps) {
  return (
    <div className="flex flex-col gap-4">
      <div className="rounded-lg border border-slate-200">
        <div className="border-b border-slate-200 px-4 py-3">
          <h3 className="text-sm font-semibold text-slate-900">
            Datos personales
          </h3>
        </div>
        <div className="divide-y divide-slate-100">
          <div className="flex justify-between px-4 py-3">
            <span className="text-sm text-slate-400">Nombre</span>
            <span className="text-sm font-semibold text-slate-900">{data.name}</span>
          </div>
          <div className="flex justify-between px-4 py-3">
            <span className="text-sm text-slate-400">Correo</span>
            <span className="text-sm font-semibold text-slate-900">{data.email}</span>
          </div>
          <div className="flex justify-between px-4 py-3">
            <span className="text-sm text-slate-400">Documento</span>
            <span className="text-sm font-semibold text-slate-900">{data.documentNumber}</span>
          </div>
        </div>
      </div>

      <div className="rounded-lg border border-slate-200">
        <div className="border-b border-slate-200 px-4 py-3">
          <h3 className="text-sm font-semibold text-slate-900">
            Archivos
          </h3>
        </div>
        <div className="grid grid-cols-2 gap-4 p-4">
          <FileThumbnail file={documentFile} name="Documento" />
          <FileThumbnail file={selfieFile} name="Selfie" />
        </div>
      </div>

      {error && (
        <p className="text-sm text-red-500" role="alert">
          {error}
        </p>
      )}

      <Button onClick={onSubmit} loading={isSubmitting} className="w-full">
        {isSubmitting ? 'Enviando...' : 'Enviar verificación'}
      </Button>

      <div className="text-left">
        <button
          type="button"
          onClick={onBack}
          className="text-sm text-slate-500"
        >
          Atrás
        </button>
      </div>
    </div>
  )
}
