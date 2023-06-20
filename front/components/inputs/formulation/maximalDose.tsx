/**
 * The external imports
 */
import { useTranslation } from 'next-i18next'
import { useFormContext } from 'react-hook-form'

/**
 * The internal imports
 */
import { Number } from '@/components'
import { DISPLAY_DOSE } from '@/lib/config/constants'
import type { DefaultFormulationComponent } from '@/types'

const MaximalDose: DefaultFormulationComponent = ({ index }) => {
  const { t } = useTranslation('formulations')
  const { watch } = useFormContext()

  const watchMedicationForm = watch(
    `formulationsAttributes[${index}].medicationForm`
  )
  const watchByAge = watch(`formulationsAttributes[${index}].byAge`)

  if (DISPLAY_DOSE.includes(watchMedicationForm) && !watchByAge) {
    return (
      <Number
        name={`formulationsAttributes[${index}].maximalDose`}
        label={t('maximalDose')}
        precision={2}
        isRequired
      />
    )
  }

  return null
}

export default MaximalDose
