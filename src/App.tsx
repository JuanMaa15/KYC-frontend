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
    <div className="flex min-h-screen items-center justify-center bg-gray-50 p-4 dark:bg-gray-950">
      {view === 'wizard' && <KycWizardPage onComplete={handleComplete} />}
      {view === 'status' && verificationId && (
        <StatusPage verificationId={verificationId} />
      )}
    </div>
  )
}
