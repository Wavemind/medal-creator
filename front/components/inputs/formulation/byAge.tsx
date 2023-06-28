/**
 * The external imports
 */
import React, { useEffect } from 'react'
import { useTranslation } from 'next-i18next'
import { useFormContext } from 'react-hook-form'

/**
 * The internal imports
 */
import { Checkbox } from '@/components'
import { FIXED_DOSE_FORMULATIONS } from '@/lib/config/constants'
import type { DefaultFormulationComponent } from '@/types'

const ByAge: DefaultFormulationComponent = ({ index }) => {
  const { t } = useTranslation('formulations')
  const { watch, setValue } = useFormContext()

  const watchMedicationForm = watch(
    `formulationsAttributes[${index}].medicationForm`
  )

  useEffect(() => {
    if (FIXED_DOSE_FORMULATIONS.includes(watchMedicationForm)) {
      setValue(`formulationsAttributes[${index}].byAge`, true)
    }
  }, [watchMedicationForm])

  return (
    <Checkbox
      label={t('byAge')}
      name={`formulationsAttributes[${index}].byAge`}
      isDisabled={FIXED_DOSE_FORMULATIONS.includes(watchMedicationForm)}
    />
  )
}

export default ByAge
