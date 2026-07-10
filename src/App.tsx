import { useState } from 'react'
import KycWizardPage from './pages/kyc-wizard/KycWizardPage'
import StatusPage from './pages/status/StatusPage'

type View = 'wizard' | 'status'

export default function App() {
  const [view, setView] = useState<View>('wizard')
  const [verificationId, setVerificationId] = useState<string | null>(null)

  function handleComplete(id: string) {
    setVerificationId(id)
    setView('status')
  }

  return (
    <div className="flex min-h-screen flex-col bg-slate-50">
      <header className="flex h-12 items-center border-b border-slate-200 bg-white px-4">
        <div className="mx-auto flex w-full max-w-[480px] items-center gap-2.5">
          <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-blue-600">
            <span className="text-xs font-bold tracking-widest text-white">KYC</span>
          </div>
          <span className="text-sm font-semibold text-slate-900">
            Verificación de identidad
          </span>
        </div>
      </header>

      <main className="flex flex-1 flex-col items-center justify-center p-4">
        {view === 'wizard' && <KycWizardPage onComplete={handleComplete} />}
        {view === 'status' && verificationId && (
          <StatusPage
            verificationId={verificationId}
            onReset={() => {
              setView('wizard')
              setVerificationId(null)
            }}
          />
        )}
      </main>

      <footer className="border-t border-slate-200 py-6 text-center">
        <p className="text-sm text-slate-400">KYC</p>
        <p className="mt-1 text-xs text-slate-400">
          &copy; 2026 &mdash; Secure Identity Platform
        </p>
      </footer>
    </div>
  )
}
