/**
 * The external imports
 */
import { useTranslation } from 'next-i18next'
import { useFormContext } from 'react-hook-form'
import { useEffect, type FC } from 'react'

/**
 * The internal imports
 */
import { Number } from '@/components'
import { DISPLAY_LIQUID_CONCENTRATION } from '@/lib/config/constants'

const LiquidConcentration: FC<{ index: number }> = ({ index }) => {
  const { t } = useTranslation('formulations')
  const { watch, getValues, setValue } = useFormContext()

  const watchMedicationForm = watch(
    `formulationsAttributes[${index}].medicationForm`
  )
  const watchByAge = watch(`formulationsAttributes[${index}].byAge`)

  // TODO CHECK IF IT WORK
  useEffect(() => {
    if (
      getValues(`formulationsAttributes[${index}].liquidConcentration`) &&
      !(
        !watchByAge &&
        DISPLAY_LIQUID_CONCENTRATION.includes(watchMedicationForm)
      )
    ) {
      setValue(
        `formulationsAttributes[${index}].liquidConcentration`,
        undefined
      )
    }
  }, [watchByAge, watchMedicationForm])

  if (
    DISPLAY_LIQUID_CONCENTRATION.includes(watchMedicationForm) &&
    !watchByAge
  ) {
    return (
      <Number
        name={`formulationsAttributes[${index}].liquidConcentration`}
        label={t('liquidConcentration')}
        isRequired
      />
    )
  }

  return null
}

export default LiquidConcentration
