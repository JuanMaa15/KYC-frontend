import type { Step } from './useKycWizard'

interface WizardProgressProps {
  currentStep: Step
  totalSteps?: number
}

const labels = ['Datos', 'Documento', 'Selfie', 'Revisión']

export default function WizardProgress({
  currentStep,
  totalSteps = 4,
}: WizardProgressProps) {
  return (
    <div className="flex items-center gap-1 text-sm">
      {Array.from({ length: totalSteps }, (_, i) => (
        <div key={i} className="flex items-center gap-1">
          <span
            className={
              i <= currentStep
                ? 'font-semibold text-blue-600 dark:text-blue-400'
                : 'text-gray-400 dark:text-gray-600'
            }
          >
            {labels[i]}
          </span>
          {i < totalSteps - 1 && (
            <span className="text-gray-300 dark:text-gray-700">→</span>
          )}
        </div>
      ))}
    </div>
  )
}
