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
    <div className="mx-auto flex w-full max-w-lg flex-col items-center gap-6 p-4">
      <div className="flex flex-col items-center gap-1">
        <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-blue-600 shadow-sm dark:bg-blue-500">
          <span className="text-lg font-bold tracking-widest text-white">KYC</span>
        </div>
        <h1 className="text-lg font-semibold text-gray-900 dark:text-gray-100">
          Verificación de identidad
        </h1>
        <p className="text-xs text-gray-500 dark:text-gray-400">
          Completa los pasos para verificar tu identidad
        </p>
      </div>

      <div className="w-full rounded-xl border border-gray-200 bg-white p-6 shadow-sm dark:border-gray-700 dark:bg-gray-900">
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
              <Button onClick={nextStep} disabled={!canProceed()}>
                Siguiente
              </Button>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
