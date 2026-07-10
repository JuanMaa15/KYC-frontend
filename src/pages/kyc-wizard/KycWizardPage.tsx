import { useKycWizard } from './useKycWizard'
import WizardProgress from './WizardProgress'
import StepPersonalData from './StepPersonalData'
import StepDocumentPhoto from './StepDocumentPhoto'
import StepSelfie from './StepSelfie'
import StepReview from './StepReview'
import Button from '../../components/Button'

interface KycWizardPageProps {
  onComplete: (verificationId: string) => void
}

export default function KycWizardPage({ onComplete }: KycWizardPageProps) {
  const {
    currentStep,
    personalData,
    personalErrors,
    documentFile,
    selfieFile,
    isSubmitting,
    error,
    setPersonalData,
    setDocumentFile,
    setSelfieFile,
    canProceed,
    nextStep,
    prevStep,
    submit,
  } = useKycWizard()

  async function handleSubmit() {
    const id = await submit()
    if (id) onComplete(id)
  }

  return (
    <div className="mx-auto flex w-full max-w-[480px] flex-col py-16">
      <div className="w-full rounded-2xl bg-gradient-to-r from-blue-600 to-indigo-600 p-6 shadow-sm">
        <div className="flex items-center gap-4">
          <div className="flex h-12 w-12 flex-shrink-0 items-center justify-center rounded-full bg-white/15 ring-1 ring-white/30">
            <svg className="h-5.5 w-5.5 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor" aria-hidden="true">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9 12.75L11.25 15 15 9.75m-3-7.036A11.959 11.959 0 013.598 6 11.99 11.99 0 003 9.749c0 5.592 3.824 10.29 9 11.623 5.176-1.332 9-6.03 9-11.622 0-1.31-.21-2.571-.598-3.751h-.152c-3.196 0-6.1-1.248-8.25-3.285z" />
            </svg>
          </div>
          <div>
            <h1 className="text-lg font-bold text-white">
              Verificación de identidad
            </h1>
            <p className="text-sm text-white/90">
              Completa los pasos para verificar tu identidad de forma segura.
            </p>
          </div>
        </div>
        <div className="mt-4 flex gap-4">
          <span className="text-xs text-white">✓ Seguro</span>
          <span className="text-xs text-white">✓ Rápido</span>
          <span className="text-xs text-white">✓ Confiable</span>
        </div>
      </div>

      <div className="mt-6 w-full animate-fade-in rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
        <div className="flex flex-col gap-6">
          <WizardProgress currentStep={currentStep} />

          {currentStep === 0 && (
            <StepPersonalData
              data={personalData}
              errors={personalErrors}
              onChange={setPersonalData}
            />
          )}
          {currentStep === 1 && (
            <StepDocumentPhoto file={documentFile} onChange={setDocumentFile} />
          )}
          {currentStep === 2 && (
            <StepSelfie file={selfieFile} onChange={setSelfieFile} />
          )}
          {currentStep === 3 && (
            <StepReview
              data={personalData}
              documentFile={documentFile}
              selfieFile={selfieFile}
              isSubmitting={isSubmitting}
              error={error}
              onSubmit={handleSubmit}
              onBack={prevStep}
            />
          )}

          {currentStep < 3 && (
            <div className="flex justify-between">
              <Button
                variant="ghost"
                onClick={prevStep}
                disabled={currentStep === 0}
              >
                Atrás
              </Button>
              <Button onClick={nextStep} disabled={!canProceed()} className="px-6">
                Siguiente
              </Button>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
