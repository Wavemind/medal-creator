/**
 * The external imports
 */
import { useMemo, useEffect } from 'react'
import { useTranslation } from 'next-i18next'
import { useFormContext } from 'react-hook-form'

/**
 * The internal imports
 */
import Number from '@/components/inputs/number'
import {
  DISPLAY_DOSE,
  DISPLAY_LIQUID_CONCENTRATION,
} from '@/lib/config/constants'
import type { DefaultFormulationProps } from '@/types'

const DoseForm: DefaultFormulationProps = ({ index, isDisabled }) => {
  const { t } = useTranslation('formulations')
  const { watch, getValues, setValue } = useFormContext()

  const watchMedicationForm = watch(
    `formulationsAttributes[${index}].medicationForm`
  )
  const watchByAge = watch(`formulationsAttributes[${index}].byAge`)

  useEffect(() => {
    if (
      getValues(`formulationsAttributes[${index}].doseForm`) &&
      !(!watchByAge && DISPLAY_DOSE.includes(watchMedicationForm))
    ) {
      setValue(`formulationsAttributes[${index}].doseForm`, undefined)
    }
  }, [watchByAge, watchMedicationForm])

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
        isDisabled={isDisabled}
      />
    )
  }

  return null
}

export default DoseForm
