/**
 * The external imports
 */
import React, { useEffect, useMemo } from 'react'
import { useTranslation } from 'next-i18next'
import { useFormContext } from 'react-hook-form'

/**
 * The internal imports
 */
import { Select } from '@/components'
import {
  AnswerTypesEnum,
  CATEGORIES_DISABLING_ANSWER_TYPE,
  VariableCategoryEnum,
} from '@/lib/config/constants'
import { useGetAnswerTypesQuery } from '@/lib/api/modules'
import type { AnswerTypeComponent } from '@/types'

const AnswerType: AnswerTypeComponent = ({ isDisabled }) => {
  const { t } = useTranslation('variables')
  const { watch, setValue } = useFormContext()

  const { data: answerTypes, isSuccess: isAnswerTypeSuccess } =
    useGetAnswerTypesQuery()

  const watchCategory: VariableCategoryEnum = watch('type')

  const answerTypeOptions = useMemo(() => {
    if (isAnswerTypeSuccess) {
      return answerTypes.map(answerType => ({
        value: answerType.id,
        label: t(`answerTypes.${answerType.labelKey}`, {
          defaultValue: '',
        }),
      }))
    }

    return []
  }, [isAnswerTypeSuccess])

  /**
   * Set default answerType value based on category
   */
  useEffect(() => {
    if (
      [VariableCategoryEnum.ComplaintCategory, VariableCategoryEnum.Vaccine].includes(
        watchCategory
      )
    ) {
      setValue('answerType', AnswerTypesEnum.RadioBoolean)
    } else if (
      [
        VariableCategoryEnum.BasicMeasurement,
        VariableCategoryEnum.VitalSignAnthropometric,
      ].includes(watchCategory)
    ) {
      setValue('answerType', AnswerTypesEnum.InputFloat)
    } else if (watchCategory === VariableCategoryEnum.BackgroundCalculation) {
      setValue('answerType', AnswerTypesEnum.FormulaFloat)
    }
  }, [watchCategory])

  return (
    <Select
      label={t('answerType')}
      options={answerTypeOptions}
      name='answerType'
      isDisabled={
        CATEGORIES_DISABLING_ANSWER_TYPE.includes(watchCategory) || isDisabled
      }
      isRequired
    />
  )
}

export default AnswerType