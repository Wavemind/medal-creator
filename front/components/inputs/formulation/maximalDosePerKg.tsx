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

const MaximalDosePerKg: FC<{ index: number }> = ({ index }) => {
  const { t } = useTranslation('formulations')
  const { watch, getValues, setValue } = useFormContext()

  const watchMedicationForm = watch(
    `formulationsAttributes[${index}].medicationForm`
  )
  const watchByAge = watch(`formulationsAttributes[${index}].byAge`)

  // TODO CHECK IF IT WORK
  useEffect(() => {
    if (
      getValues(`formulationsAttributes[${index}].maximalDosePerKg`) &&
      !(!watchByAge && DISPLAY_DOSE.includes(watchMedicationForm))
    ) {
      setValue(`formulationsAttributes[${index}].maximalDosePerKg`, undefined)
    }
  }, [watchByAge, watchMedicationForm])

  if (DISPLAY_DOSE.includes(watchMedicationForm) && !watchByAge) {
    return (
      <Number
        name={`formulationsAttributes[${index}].maximalDosePerKg`}
        label={t('maximalDosePerKg')}
        precision={2}
        isRequired
      />
    )
  }

  return null
}

export default MaximalDosePerKg
