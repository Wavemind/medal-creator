/**
 * The external imports
 */
import React, { useEffect } from 'react'
import { useTranslation } from 'next-i18next'
import { useFormContext } from 'react-hook-form'
import type { FC } from 'react'

/**
 * The internal imports
 */
import Checkbox from '@/components/inputs/checkbox'
import { CATEGORIES_DISPLAYING_ESTIMABLE_OPTION } from '@/lib/config/constants'
import type { VariableCategoryEnum } from '@/types'

const Estimable: FC = () => {
  const { t } = useTranslation('variables')

  const { watch, getValues, setValue } = useFormContext()
  const watchCategory: VariableCategoryEnum = watch('type')

  useEffect(() => {
    if (
      !CATEGORIES_DISPLAYING_ESTIMABLE_OPTION.includes(watchCategory) &&
      getValues('isEstimable')
    ) {
      setValue('isEstimable', false)
    }
  }, [watchCategory])

  if (CATEGORIES_DISPLAYING_ESTIMABLE_OPTION.includes(watchCategory)) {
    return <Checkbox label={t('isEstimable')} name='isEstimable' />
  }

  return null
}

export default Estimable
