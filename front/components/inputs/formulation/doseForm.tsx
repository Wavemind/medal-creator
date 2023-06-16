/**
 * The external imports
 */
import { useTranslation } from 'next-i18next'
import { useFormContext } from 'react-hook-form'
import { useMemo, type FC } from 'react'

/**
 * The internal imports
 */
import { Number } from '@/components'
import {
  DISPLAY_DOSE,
  DISPLAY_LIQUID_CONCENTRATION,
} from '@/lib/config/constants'

const DoseForm: FC<{ index: number }> = ({ index }) => {
  const { t } = useTranslation('formulations')
  const { watch } = useFormContext()

  const watchMedicationForm = watch(
    `formulationsAttributes[${index}].medicationForm`
  )
  const watchByAge = watch(`formulationsAttributes[${index}].byAge`)

  const label = useMemo(() => {
    if (DISPLAY_LIQUID_CONCENTRATION.includes(watchMedicationForm)) {
      return t('doseFormMl')
    } else {
      return t('doseFormMg')
    }
  }, [t])

  if (DISPLAY_DOSE.includes(watchMedicationForm) && !watchByAge) {
    return (
      <Number
        name={`formulationsAttributes[${index}].doseForm`}
        label={label}
        precision={2}
        isRequired
      />
    )
  }

  return null
}

export default DoseForm
