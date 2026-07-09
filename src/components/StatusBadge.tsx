import type { VerificationStatus } from '../types'

interface StatusBadgeProps {
  status: VerificationStatus
}

const config: Record<VerificationStatus, { label: string; classes: string }> = {
  pending: {
    label: 'Pendiente',
    classes: 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-200',
  },
  approved: {
    label: 'Aprobado',
    classes: 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200',
  },
  rejected: {
    label: 'Rechazado',
    classes: 'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200',
  },
}

export default function StatusBadge({ status }: StatusBadgeProps) {
  const { label, classes } = config[status]
  return (
    <span
      className={`inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-semibold ${classes}`}
    >
      {label}
    </span>
  )
}
