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
    <div className="flex items-center justify-center gap-0">
      {Array.from({ length: totalSteps }, (_, i) => {
        const isCurrent = i === currentStep
        const isCompleted = i < currentStep

        return (
          <div key={i} className="flex items-center">
            <div className="flex flex-col items-center gap-1.5">
              <span
                className={`flex h-8 w-8 items-center justify-center rounded-full text-xs font-bold transition-colors ${
                  isCompleted
                    ? 'bg-blue-600 text-white dark:bg-blue-500'
                    : isCurrent
                      ? 'border-2 border-blue-600 bg-blue-600 text-white dark:border-blue-400 dark:bg-blue-500'
                      : 'border-2 border-gray-300 bg-white text-gray-400 dark:border-gray-600 dark:bg-gray-900 dark:text-gray-500'
                }`}
              >
                {isCompleted ? (
                  <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" aria-hidden="true">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M5 13l4 4L19 7" />
                  </svg>
                ) : (
                  i + 1
                )}
              </span>
              <span
                className={
                  isCurrent
                    ? 'text-xs font-semibold text-blue-600 dark:text-blue-400'
                    : isCompleted
                      ? 'text-xs text-blue-600 dark:text-blue-400'
                      : 'text-xs text-gray-400 dark:text-gray-500'
                }
              >
                {labels[i]}
              </span>
            </div>
            {i < totalSteps - 1 && (
              <div
                className={`mx-2 h-0.5 w-10 transition-colors sm:w-16 ${
                  i < currentStep
                    ? 'bg-blue-600 dark:bg-blue-500'
                    : 'bg-gray-300 dark:bg-gray-700'
                }`}
              />
            )}
          </div>
        )
      })}
    </div>
  )
}
