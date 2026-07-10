import { useRef, useState, type DragEvent } from 'react'

interface FileUploadProps {
  onFile: (file: File | null) => void
  accept?: string
  error?: string
  preview?: string | null
}

const MAX_SIZE = 10 * 1024 * 1024
const ACCEPTED_TYPES = ['image/jpeg', 'image/png']

export default function FileUpload({
  onFile,
  accept = '.jpg,.jpeg,.png',
  error,
  preview,
}: FileUploadProps) {
  const inputRef = useRef<HTMLInputElement>(null)
  const [dragging, setDragging] = useState(false)
  const [validationError, setValidationError] = useState<string | null>(null)

  const currentError = validationError ?? error

  function validate(file: File): string | null {
    if (!ACCEPTED_TYPES.includes(file.type)) {
      return 'Solo se permiten archivos JPEG y PNG.'
    }
    if (file.size > MAX_SIZE) {
      return 'El archivo no debe superar los 10 MB.'
    }
    return null
  }

  function handleFile(file: File | null) {
    setValidationError(null)
    if (!file) {
      onFile(null)
      return
    }
    const err = validate(file)
    if (err) {
      setValidationError(err)
      onFile(null)
      return
    }
    onFile(file)
  }

  function handleDrop(e: DragEvent) {
    e.preventDefault()
    setDragging(false)
    const file = e.dataTransfer.files[0]
    if (file) handleFile(file)
  }

  function handleDragOver(e: DragEvent) {
    e.preventDefault()
    setDragging(true)
  }

  function handleDragLeave() {
    setDragging(false)
  }

  function handleChange() {
    const file = inputRef.current?.files?.[0]
    if (file) handleFile(file)
  }

  function handleRemove() {
    setValidationError(null)
    onFile(null)
    if (inputRef.current) inputRef.current.value = ''
  }

  return (
    <div className="flex flex-col gap-2">
      <div
        role="button"
        tabIndex={0}
        aria-label="Subir archivo"
        onDrop={handleDrop}
        onDragOver={handleDragOver}
        onDragLeave={handleDragLeave}
        onClick={() => inputRef.current?.click()}
        onKeyDown={(e) => {
          if (e.key === 'Enter' || e.key === ' ') inputRef.current?.click()
        }}
        className={[
          'flex cursor-pointer flex-col items-center justify-center rounded-lg border-2 border-dashed p-6 transition-colors',
          dragging
            ? 'border-blue-500 bg-blue-50 dark:bg-blue-950'
            : 'border-gray-300 hover:border-gray-400 dark:border-gray-600 dark:hover:border-gray-500',
          preview ? 'py-2' : 'py-6',
        ].join(' ')}
      >
        <input
          ref={inputRef}
          type="file"
          accept={accept}
          onChange={handleChange}
          className="hidden"
          aria-hidden="true"
        />

        {preview ? (
          <div className="relative w-full max-w-xs">
            <img
              src={preview}
              alt="Vista previa"
              className="max-h-48 w-full rounded object-contain"
            />
          </div>
        ) : (
          <div className="flex flex-col items-center gap-1 text-sm text-gray-500 dark:text-gray-400">
            <svg
              className="h-8 w-8"
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
              aria-hidden="true"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={1.5}
                d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12"
              />
            </svg>
            <span>Arrastra o haz clic para subir</span>
            <span className="text-xs">JPEG / PNG · Máx 10 MB</span>
          </div>
        )}
      </div>

      {preview && (
        <button
          type="button"
          onClick={handleRemove}
          className="self-center text-xs text-red-600 hover:underline dark:text-red-400"
        >
          Eliminar archivo
        </button>
      )}

      {currentError && (
        <p className="text-xs text-red-500" role="alert">
          {currentError}
        </p>
      )}
    </div>
  )
}
