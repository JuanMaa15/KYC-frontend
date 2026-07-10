import { usePolling } from '../../hooks/usePolling'
import Spinner from '../../components/Spinner'
import StatusBadge from '../../components/StatusBadge'
import Button from '../../components/Button'

interface StatusPageProps {
  verificationId: string
  onReset?: () => void
}

function HeroCard({
  gradient,
  title,
  subtitle,
}: {
  gradient: string
  title: string
  subtitle: string
}) {
  return (
    <div className={`w-full rounded-2xl ${gradient} p-6 shadow-sm`}>
      <div className="flex items-center gap-4">
        <div className="flex h-12 w-12 flex-shrink-0 items-center justify-center rounded-full bg-white/15 ring-1 ring-white/30">
          <svg className="h-5.5 w-5.5 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor" aria-hidden="true">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9 12.75L11.25 15 15 9.75m-3-7.036A11.959 11.959 0 013.598 6 11.99 11.99 0 003 9.749c0 5.592 3.824 10.29 9 11.623 5.176-1.332 9-6.03 9-11.622 0-1.31-.21-2.571-.598-3.751h-.152c-3.196 0-6.1-1.248-8.25-3.285z" />
          </svg>
        </div>
        <div>
          <h1 className="text-lg font-bold text-white">{title}</h1>
          <p className="text-sm text-white/90">{subtitle}</p>
        </div>
      </div>
    </div>
  )
}

export default function StatusPage({ verificationId, onReset }: StatusPageProps) {
  const { verification, isLoading, error, stopped } = usePolling(verificationId)

  if (isLoading && !verification) {
    return (
      <div className="mx-auto flex w-full max-w-[480px] flex-col gap-6 py-16">
        <HeroCard
          gradient="bg-gradient-to-r from-blue-600 to-indigo-600"
          title="Verificando tu identidad"
          subtitle="Estamos verificando tu identidad..."
        />
        <div className="flex w-full flex-col items-center gap-4 rounded-2xl border border-slate-200 bg-white p-8 shadow-sm">
          <Spinner size="lg" />
          <p className="text-sm text-slate-600">
            Verificando tu identidad...
          </p>
        </div>
      </div>
    )
  }

  if (error) {
    return (
      <div className="mx-auto flex w-full max-w-[480px] flex-col gap-6 py-16">
        <HeroCard
          gradient="bg-gradient-to-r from-blue-600 to-indigo-600"
          title="Verificando tu identidad"
          subtitle="Estamos verificando tu identidad..."
        />
        <div className="flex w-full flex-col items-center gap-4 rounded-2xl border border-red-200 bg-white p-8 shadow-sm">
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
      <div className="mx-auto flex w-full max-w-[480px] flex-col gap-6 py-16">
        <HeroCard
          gradient="bg-gradient-to-r from-blue-600 to-indigo-600"
          title="Verificando tu identidad"
          subtitle="Estamos verificando tu identidad..."
        />
        <div className="flex w-full flex-col items-center gap-4 rounded-2xl border border-yellow-200 bg-white p-8 shadow-sm">
          <svg className="h-10 w-10 text-yellow-500" fill="none" viewBox="0 0 24 24" stroke="currentColor" aria-hidden="true">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M12 6v6h4.5m4.5 0a9 9 0 11-18 0 9 9 0 0118 0z" />
          </svg>
          <StatusBadge status="pending" />
          <p className="text-sm text-slate-600">
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
        <div className="mx-auto flex w-full max-w-[480px] flex-col gap-6 py-16">
          <HeroCard
            gradient="bg-gradient-to-r from-blue-600 to-indigo-600"
            title="Verificando tu identidad"
            subtitle="Estamos verificando tu identidad..."
          />
          <div className="flex w-full flex-col items-center gap-4 rounded-2xl border border-slate-200 bg-white p-8 shadow-sm">
            <Spinner size="lg" />
            <StatusBadge status="pending" />
            <p className="text-sm text-slate-600">
              Verificando tu identidad...
            </p>
          </div>
        </div>
      )
    }

    const isApproved = verification.status === 'approved'
    return (
      <div className="mx-auto flex w-full max-w-[480px] flex-col gap-6 py-16">
        <HeroCard
          gradient={
            isApproved
              ? 'bg-gradient-to-r from-green-600 to-emerald-600'
              : 'bg-gradient-to-r from-red-600 to-rose-600'
          }
          title={
            isApproved
              ? 'Verificación exitosa'
              : 'Verificación rechazada'
          }
          subtitle={
            isApproved
              ? 'Tu identidad ha sido verificada correctamente.'
              : 'No pudimos verificar tu identidad.'
          }
        />
        <div
          className={`flex w-full flex-col items-center gap-4 rounded-2xl border bg-white p-8 shadow-sm ${
            isApproved
              ? 'border-green-200'
              : 'border-red-200'
          }`}
        >
          <StatusBadge status={verification.status} />
          <h2
            className={`text-xl font-semibold ${
              isApproved ? 'text-green-600' : 'text-red-600'
            }`}
          >
            {isApproved ? 'Aprobado' : 'Rechazado'}
          </h2>
          {onReset && (
            <Button
              variant={isApproved ? 'secondary' : 'primary'}
              onClick={onReset}
            >
              Volver al inicio
            </Button>
          )}
        </div>
      </div>
    )
  }

  return null
}
