import { usePolling } from '../../hooks/usePolling'
import Spinner from '../../components/Spinner'
import StatusBadge from '../../components/StatusBadge'
import Button from '../../components/Button'

interface StatusPageProps {
  verificationId: string
  onReset?: () => void
}

export default function StatusPage({ verificationId, onReset }: StatusPageProps) {
  const { verification, isLoading, error, stopped } = usePolling(verificationId)

  const header = (
    <div className="flex flex-col items-center gap-1">
      <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-blue-600 shadow-sm dark:bg-blue-500">
        <span className="text-lg font-bold tracking-widest text-white">KYC</span>
      </div>
      <h1 className="text-lg font-semibold text-gray-900 dark:text-gray-100">
        Resultado de verificación
      </h1>
    </div>
  )

  if (isLoading && !verification) {
    return (
      <div className="mx-auto flex w-full max-w-lg flex-col items-center gap-6 p-4">
        {header}
        <div className="flex w-full flex-col items-center gap-4 rounded-xl border border-gray-200 bg-white p-8 shadow-sm dark:border-gray-700 dark:bg-gray-900">
          <Spinner size="lg" />
          <p className="text-sm text-gray-600 dark:text-gray-400">
            Verificando tu identidad...
          </p>
        </div>
      </div>
    )
  }

  if (error) {
    return (
      <div className="mx-auto flex w-full max-w-lg flex-col items-center gap-6 p-4">
        {header}
        <div className="flex w-full flex-col items-center gap-4 rounded-xl border border-red-200 bg-white p-8 shadow-sm dark:border-red-800 dark:bg-gray-900">
          <svg className="h-10 w-10 text-red-500" fill="none" viewBox="0 0 24 24" stroke="currentColor" aria-hidden="true">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M12 9v3.75m9-.75a9 9 0 11-18 0 9 9 0 0118 0zm-9 3.75h.008v.008H12v-.008z" />
          </svg>
          <p className="text-sm text-red-500" role="alert">{error}</p>
          {onReset && (
            <Button variant="primary" onClick={onReset}>
              Volver a intentar
            </Button>
          )}
        </div>
      </div>
    )
  }

  if (stopped && verification?.status === 'pending') {
    return (
      <div className="mx-auto flex w-full max-w-lg flex-col items-center gap-6 p-4">
        {header}
        <div className="flex w-full flex-col items-center gap-4 rounded-xl border border-yellow-200 bg-white p-8 shadow-sm dark:border-yellow-800 dark:bg-gray-900">
          <svg className="h-10 w-10 text-yellow-500" fill="none" viewBox="0 0 24 24" stroke="currentColor" aria-hidden="true">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M12 6v6h4.5m4.5 0a9 9 0 11-18 0 9 9 0 0118 0z" />
          </svg>
          <StatusBadge status="pending" />
          <p className="text-sm text-gray-600 dark:text-gray-400">
            La verificación está tomando más tiempo de lo esperado.
            Intenta de nuevo más tarde.
          </p>
          {onReset && (
            <Button variant="primary" onClick={onReset}>
              Volver a intentar
            </Button>
          )}
        </div>
      </div>
    )
  }

  if (verification) {
    if (verification.status === 'pending') {
      return (
        <div className="mx-auto flex w-full max-w-lg flex-col items-center gap-6 p-4">
          {header}
          <div className="flex w-full flex-col items-center gap-4 rounded-xl border border-blue-200 bg-white p-8 shadow-sm dark:border-blue-800 dark:bg-gray-900">
            <Spinner size="lg" />
            <StatusBadge status="pending" />
            <p className="text-sm text-gray-600 dark:text-gray-400">
              Verificando tu identidad...
            </p>
          </div>
        </div>
      )
    }

    const isApproved = verification.status === 'approved'
    return (
      <div className="mx-auto flex w-full max-w-lg flex-col items-center gap-6 p-4">
        {header}
        <div className={`flex w-full flex-col items-center gap-4 rounded-xl border bg-white p-8 shadow-sm dark:bg-gray-900 ${
          isApproved
            ? 'border-green-200 dark:border-green-800'
            : 'border-red-200 dark:border-red-800'
        }`}>
          {isApproved ? (
            <svg className="h-12 w-12 text-green-500" fill="none" viewBox="0 0 24 24" stroke="currentColor" aria-hidden="true">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9 12.75L11.25 15 15 9.75M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
          ) : (
            <svg className="h-12 w-12 text-red-500" fill="none" viewBox="0 0 24 24" stroke="currentColor" aria-hidden="true">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9.75 9.75l4.5 4.5m0-4.5l-4.5 4.5M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
          )}
          <StatusBadge status={verification.status} />
          <p className={`text-lg font-semibold ${
            isApproved ? 'text-green-600' : 'text-red-600'
          }`}>
            {isApproved ? 'Aprobado' : 'Rechazado'}
          </p>
          {onReset && (
            <Button variant={isApproved ? 'secondary' : 'primary'} onClick={onReset}>
              {isApproved ? 'Volver al inicio' : 'Volver a intentar'}
            </Button>
          )}
        </div>
      </div>
    )
  }

  return null
}
