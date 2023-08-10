/**
 * The external imports
 */
import React, { useEffect, useMemo } from 'react'
import { useTranslation } from 'next-i18next'
import { useFormContext } from 'react-hook-form'

/**
 * The internal imports
 */
import Select from '@/components/inputs/select'
import {
  AnswerTypesEnum,
  CATEGORIES_DISABLING_ANSWER_TYPE,
} from '@/lib/config/constants'
import { useGetAnswerTypesQuery } from '@/lib/api/modules/enhanced/answerType.enhanced'
import { VariableCategoryEnum } from '@/types'
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
      [
        VariableCategoryEnum.ComplaintCategory,
        VariableCategoryEnum.Vaccine,
      ].includes(watchCategory)
    ) {
      setValue('answerTypeId', AnswerTypesEnum.RadioBoolean)
    } else if (
      [
        VariableCategoryEnum.BasicMeasurement,
        VariableCategoryEnum.VitalSignAnthropometric,
      ].includes(watchCategory)
    ) {
      setValue('answerTypeId', AnswerTypesEnum.InputFloat)
    } else if (watchCategory === VariableCategoryEnum.BackgroundCalculation) {
      setValue('answerTypeId', AnswerTypesEnum.FormulaFloat)
    }
  }, [watchCategory])

  return (
    <Select
      label={t('answerType')}
      options={answerTypeOptions}
      name='answerTypeId'
      isDisabled={
        CATEGORIES_DISABLING_ANSWER_TYPE.includes(watchCategory) || isDisabled
      }
      isRequired
    />
  )
}

export default AnswerType
