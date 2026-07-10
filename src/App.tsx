import { useEffect, useState } from 'react'
import KycWizardPage from './pages/kyc-wizard/KycWizardPage'
import StatusPage from './pages/status/StatusPage'

type View = 'wizard' | 'status'

export default function App() {
  const [view, setView] = useState<View>('wizard')
  const [verificationId, setVerificationId] = useState<string | null>(null)
  const [dark, setDark] = useState(() => {
    const stored = localStorage.getItem('theme')
    if (stored) return stored === 'dark'
    return window.matchMedia('(prefers-color-scheme: dark)').matches
  })

  useEffect(() => {
    document.documentElement.classList.toggle('dark', dark)
    localStorage.setItem('theme', dark ? 'dark' : 'light')
  }, [dark])

  function handleComplete(id: string) {
    setVerificationId(id)
    setView('status')
  }

  return (
    <div className="flex min-h-screen flex-col bg-slate-50 dark:bg-slate-900">
      <header className="flex h-12 items-center border-b border-slate-200 bg-white px-4 dark:border-slate-700 dark:bg-slate-800">
        <div className="mx-auto flex w-full max-w-[480px] items-center gap-2.5">
          <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-blue-600">
            <span className="text-xs font-bold tracking-widest text-white">KYC</span>
          </div>
          <span className="text-sm font-semibold text-slate-900 dark:text-slate-100">
            Verificación de identidad
          </span>
          <button
            type="button"
            onClick={() => setDark(prev => !prev)}
            className="ml-auto rounded-lg p-1.5 text-slate-400 hover:bg-slate-100 hover:text-slate-600 dark:text-slate-500 dark:hover:bg-slate-700 dark:hover:text-slate-300"
            aria-label={dark ? 'Activar modo claro' : 'Activar modo oscuro'}
          >
            {dark ? (
              <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M12 3v1m0 16v1m9-9h-1M4 12H3m15.364 6.364l-.707-.707M6.343 6.343l-.707-.707m12.728 0l-.707.707M6.343 17.657l-.707.707M16 12a4 4 0 11-8 0 4 4 0 018 0z" />
              </svg>
            ) : (
              <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M20.354 15.354A9 9 0 018.646 3.646 9.003 9.003 0 0012 21a9.003 9.003 0 008.354-5.646z" />
              </svg>
            )}
          </button>
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

      <footer className="border-t border-slate-200 py-6 text-center dark:border-slate-700">
        <p className="text-sm text-slate-400">KYC</p>
        <p className="mt-1 text-xs text-slate-400">
          &copy; 2026 &mdash; Secure Identity Platform
        </p>
      </footer>
    </div>
  )
}
