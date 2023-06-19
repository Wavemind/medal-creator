/**
 * The external imports
 */
import { useEffect } from 'react'
import { useTranslation } from 'next-i18next'
import { useFormContext } from 'react-hook-form'
import type { FC } from 'react'

/**
 * The internal imports
 */
import { Number } from '@/components'
import { DISPLAY_DOSE } from '@/lib/config/constants'

const MinimalDosePerKg: FC<{ index: number }> = ({ index }) => {
  const { t } = useTranslation('formulations')
  const { watch, getValues, setValue } = useFormContext()

  const watchMedicationForm = watch(
    `formulationsAttributes[${index}].medicationForm`
  )
  const watchByAge = watch(`formulationsAttributes[${index}].byAge`)

  // TODO CHECK IF IT WORK
  useEffect(() => {
    if (
      getValues(`formulationsAttributes[${index}].minimalDosePerKg`) &&
      !(!watchByAge && DISPLAY_DOSE.includes(watchMedicationForm))
    ) {
      setValue(`formulationsAttributes[${index}].minimalDosePerKg`, undefined)
    }
  }, [watchByAge, watchMedicationForm])

  if (DISPLAY_DOSE.includes(watchMedicationForm) && !watchByAge) {
    return (
      <Number
        name={`formulationsAttributes[${index}].minimalDosePerKg`}
        label={t('minimalDosePerKg')}
        precision={2}
        isRequired
      />
    )
  }

  return null
}

export default MinimalDosePerKg
