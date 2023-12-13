/**
 * The external imports
 */
import { useTranslation } from 'next-i18next'
import { useFormContext } from 'react-hook-form'
import type { FC } from 'react'

/**
 * The internal imports
 */
import Checkbox from '@/components/inputs/checkbox'
import { IsDisabled, VariableCategoryEnum } from '@/types'

const Mandatory: FC<IsDisabled> = ({ isDisabled }) => {
  const { t } = useTranslation('variables')

  const { watch } = useFormContext()
  const watchCategory: VariableCategoryEnum = watch('type')

  if (watchCategory !== VariableCategoryEnum.BackgroundCalculation) {
    return (
      <Checkbox
        label={t('isMandatory')}
        name='isMandatory'
        isDisabled={isDisabled}
      />
    )
  }

  return null
}

export default Mandatory
