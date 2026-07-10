import { useMemo } from 'react'
import FileUpload from '../../components/FileUpload'

interface StepDocumentPhotoProps {
  file: File | null
  onChange: (file: File | null) => void
}

export default function StepDocumentPhoto({
  file,
  onChange,
}: StepDocumentPhotoProps) {
  const preview = useMemo(() => {
    if (!file) return null
    return URL.createObjectURL(file)
  }, [file])

  return (
    <div>
      <p className="mb-2 text-sm text-gray-600 dark:text-gray-400">
        Sube una foto legible de tu documento de identidad.
      </p>
      <FileUpload
        onFile={onChange}
        preview={preview}
        accept=".jpg,.jpeg,.png"
      />
    </div>
  )
}
