import { useState } from 'react'
import KycWizardPage from './pages/kyc-wizard/KycWizardPage'

type View = 'wizard' | 'status'

export default function App() {
  const [view, setView] = useState<View>('wizard')
  const [verificationId, setVerificationId] = useState<string | null>(null)

  function handleComplete(id: string) {
    setVerificationId(id)
    setView('status')
  }

  return (
    <div className="flex min-h-screen items-center justify-center bg-gray-50 p-4 dark:bg-gray-950">
      {view === 'wizard' && <KycWizardPage onComplete={handleComplete} />}
      {view === 'status' && verificationId && (
        <p className="text-sm text-gray-600 dark:text-gray-400">
          Status: {verificationId} (próximamente)
        </p>
      )}
    </div>
  )
}
