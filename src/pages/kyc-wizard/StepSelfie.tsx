import { useMemo } from 'react'
import FileUpload from '../../components/FileUpload'

interface StepSelfieProps {
  file: File | null
  onChange: (file: File | null) => void
}

export default function StepSelfie({ file, onChange }: StepSelfieProps) {
  const preview = useMemo(() => {
    if (!file) return null
    return URL.createObjectURL(file)
  }, [file])

  return (
    <div>
      <p className="mb-2 text-sm text-gray-600 dark:text-gray-400">
        Toma una selfie sosteniendo tu documento junto a tu rostro.
      </p>
      <FileUpload
        onFile={onChange}
        preview={preview}
        accept=".jpg,.jpeg,.png"
      />
    </div>
  )
}
