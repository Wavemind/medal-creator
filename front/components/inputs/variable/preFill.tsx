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
import { CATEGORIES_DISPLAYING_PREFILL } from '@/lib/config/constants'
import type { IsDisabled, VariableCategoryEnum } from '@/types'

const PreFill: FC<IsDisabled> = ({ isDisabled }) => {
  const { t } = useTranslation('variables')

  const { watch, getValues, setValue } = useFormContext()
  const watchCategory: VariableCategoryEnum = watch('type')

  useEffect(() => {
    if (
      !CATEGORIES_DISPLAYING_PREFILL.includes(watchCategory) &&
      getValues('isPreFill')
    ) {
      setValue('isPreFill', false)
    }
  }, [watchCategory])

  if (CATEGORIES_DISPLAYING_PREFILL.includes(watchCategory)) {
    return (
      <Checkbox
        label={t('isPreFill')}
        name='isPreFill'
        isDisabled={isDisabled}
      />
    )
  }

  return null
}

export default PreFill
