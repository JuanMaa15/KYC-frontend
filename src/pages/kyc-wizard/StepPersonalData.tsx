import Input from '../../components/Input'
import type { PersonalData } from './useKycWizard'

interface StepPersonalDataProps {
  data: PersonalData
  errors: Partial<Record<keyof PersonalData, string>>
  onChange: (data: PersonalData) => void
}

export default function StepPersonalData({
  data,
  errors,
  onChange,
}: StepPersonalDataProps) {
  function handleField(field: keyof PersonalData, value: string) {
    onChange({ ...data, [field]: value })
  }

  return (
    <div className="flex flex-col gap-4">
      <Input
        label="Nombre completo"
        placeholder="Ej: Juan Pérez"
        value={data.name}
        onChange={(e) => handleField('name', e.target.value)}
        error={errors.name}
      />
      <Input
        label="Correo electrónico"
        type="email"
        placeholder="Ej: juan@ejemplo.com"
        value={data.email}
        onChange={(e) => handleField('email', e.target.value)}
        error={errors.email}
      />
      <Input
        label="Número de documento"
        placeholder="Ej: 12345678"
        value={data.documentNumber}
        onChange={(e) => handleField('documentNumber', e.target.value)}
        error={errors.documentNumber}
      />
    </div>
  )
}
