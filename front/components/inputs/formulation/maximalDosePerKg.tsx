/**
 * The external imports
 */
import { useEffect } from 'react'
import { useTranslation } from 'next-i18next'
import { useFormContext } from 'react-hook-form'

/**
 * The internal imports
 */
import { Number } from '@/components'
import { DISPLAY_DOSE } from '@/lib/config/constants'
import type { DefaultFormulationComponent } from '@/types'

const MaximalDosePerKg: DefaultFormulationComponent = ({ index }) => {
  const { t } = useTranslation('formulations')
  const { watch, getValues, setValue } = useFormContext()

  const watchMedicationForm = watch(
    `formulationsAttributes[${index}].medicationForm`
  )
  const watchByAge = watch(`formulationsAttributes[${index}].byAge`)

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