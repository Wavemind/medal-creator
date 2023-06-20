/**
 * The external imports
 */
import { useTranslation } from 'next-i18next'
import { useFormContext } from 'react-hook-form'

/**
 * The internal imports
 */
import { Number } from '@/components'
import { DISPLAY_LIQUID_CONCENTRATION } from '@/lib/config/constants'
import type { DefaultFormulationComponent } from '@/types'

const LiquidConcentration: DefaultFormulationComponent = ({ index }) => {
  const { t } = useTranslation('formulations')
  const { watch } = useFormContext()

  const watchMedicationForm = watch(
    `formulationsAttributes[${index}].medicationForm`
  )
  const watchByAge = watch(`formulationsAttributes[${index}].byAge`)

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
