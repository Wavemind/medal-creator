/**
 * The external imports
 */
import React, { useEffect, useMemo } from 'react'
import { useTranslation } from 'next-i18next'
import { useFormContext } from 'react-hook-form'

/**
 * The internal imports
 */
import Number from '@/components/inputs/number'
import { DISPLAY_UNIQUE_DOSE, MedicationFormEnum } from '@/lib/config/constants'
import type { DefaultFormulationComponent } from '@/types'

const UniqueDose: DefaultFormulationComponent = ({ index }) => {
  const { t } = useTranslation('formulations')
  const { watch, getValues, setValue } = useFormContext()

  const watchMedicationForm = watch(
    `formulationsAttributes[${index}].medicationForm`
  )
  const watchByAge = watch(`formulationsAttributes[${index}].byAge`)

  const labelTranslated = useMemo(() => {
    switch (watchMedicationForm) {
      case MedicationFormEnum.Capsule:
      case MedicationFormEnum.Tablet:
      case MedicationFormEnum.DispersibleTablet:
        return t('uniqueDoseSolid')
      case MedicationFormEnum.Suppository:
        return t('uniqueDoseSuppository')
      case MedicationFormEnum.Suspension:
      case MedicationFormEnum.Syrup:
      case MedicationFormEnum.Solution:
      case MedicationFormEnum.PowderForInjection:
        return t('uniqueDoseLiquid')
      default:
        return t('uniqueDoseGeneral')
    }
  }, [t, watchMedicationForm])

  useEffect(() => {
    if (
      getValues(`formulationsAttributes[${index}].uniqueDose`) &&
      !(watchByAge || DISPLAY_UNIQUE_DOSE.includes(watchMedicationForm))
    ) {
      setValue(`formulationsAttributes[${index}].uniqueDose`, undefined)
    }
  }, [watchByAge, watchMedicationForm])

  if (DISPLAY_UNIQUE_DOSE.includes(watchMedicationForm) || watchByAge) {
    return (
      <Number
        name={`formulationsAttributes[${index}].uniqueDose`}
        label={labelTranslated}
        precision={2}
        isRequired
      />
    )
  }

  return null
}

export default UniqueDose
