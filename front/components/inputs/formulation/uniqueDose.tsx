/**
 * The external imports
 */
import React, { useMemo } from 'react'
import { useTranslation } from 'next-i18next'
import { useFormContext } from 'react-hook-form'
import type { FC } from 'react'

/**
 * The internal imports
 */
import { Number } from '@/components'
import { DISPLAY_UNIQUE_DOSE, MedicationFormEnum } from '@/lib/config/constants'

const UniqueDose: FC<{ index: number }> = ({ index }) => {
  const { t } = useTranslation('formulations')
  const { watch } = useFormContext()

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
  }, [t])

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
