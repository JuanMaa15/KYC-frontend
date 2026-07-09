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
    <div className="mx-auto flex w-full max-w-lg flex-col gap-6 p-4">
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
  )
}
