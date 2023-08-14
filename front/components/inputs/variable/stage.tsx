/**
 * The external imports
 */
import React, { useEffect } from 'react'
import { useTranslation } from 'next-i18next'
import { useFormContext } from 'react-hook-form'
import { useConst } from '@chakra-ui/react'
import type { FC } from 'react'

/**
 * The internal imports
 */
import Select from '@/components/inputs/select'
import VariableService from '@/lib/services/variable.service'
import {
  CATEGORIES_WITHOUT_STAGE,
  CATEGORY_TO_STAGE_MAP,
} from '@/lib/config/constants'
import { camelize } from '@/lib/utils/string'
import { VariableCategoryEnum } from '@/types'

const Stage: FC = () => {
  const { t } = useTranslation('variables')
  const { watch, setValue } = useFormContext()

  const watchCategory: VariableCategoryEnum = watch('type')

  const stages = useConst(() =>
    VariableService.stages.map(stage => ({
      value: stage,
      label: t(`stages.${camelize(stage)}`, {
        defaultValue: '',
      }),
    }))
  )

  useEffect(() => {
    if (watchCategory !== VariableCategoryEnum.BackgroundCalculation) {
      setValue('stage', CATEGORY_TO_STAGE_MAP[watchCategory])
    } else {
      setValue('stage', undefined)
    }
  }, [watchCategory])

  if (!CATEGORIES_WITHOUT_STAGE.includes(watchCategory)) {
    return (
      <Select
        label={t('stage')}
        options={stages}
        name='stage'
        isRequired
        isDisabled={true}
      />
    )
  }
  return null
}

export default Stage
