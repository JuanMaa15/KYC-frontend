import { usePolling } from '../../hooks/usePolling'
import Spinner from '../../components/Spinner'
import StatusBadge from '../../components/StatusBadge'

interface StatusPageProps {
  verificationId: string
}

export default function StatusPage({ verificationId }: StatusPageProps) {
  const { verification, isLoading, error, stopped } = usePolling(verificationId)

  if (isLoading && !verification) {
    return (
      <div className="flex flex-col items-center gap-4">
        <Spinner size="lg" />
        <p className="text-gray-600 dark:text-gray-400">
          Verificando tu identidad...
        </p>
      </div>
    )
  }

  if (error) {
    return (
      <div className="flex flex-col items-center gap-4">
        <p className="text-red-500" role="alert">{error}</p>
      </div>
    )
  }

  if (stopped && verification?.status === 'pending') {
    return (
      <div className="flex flex-col items-center gap-4">
        <p className="text-gray-600 dark:text-gray-400">
          La verificacion esta tomando mas tiempo de lo esperado.
          Intenta de nuevo mas tarde.
        </p>
      </div>
    )
  }

  if (verification) {
    const isApproved = verification.status === 'approved'
    return (
      <div className="flex flex-col items-center gap-4">
        <StatusBadge status={verification.status} />
        <p className={`text-lg font-semibold ${isApproved ? 'text-green-600' : 'text-red-600'}`}>
          {isApproved ? 'Aprobado' : 'Rechazado'}
        </p>
      </div>
    )
  }

  return null
}
