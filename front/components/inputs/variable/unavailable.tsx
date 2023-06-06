/**
 * The external imports
 */
import React, { useEffect, useMemo } from 'react'
import { useTranslation } from 'next-i18next'
import { useFormContext } from 'react-hook-form'
import type { FC } from 'react'

/**
 * The internal imports
 */
import { Checkbox } from '@/components'
import {
  CATEGORIES_DISPLAYING_UNAVAILABLE_OPTION,
  CATEGORIES_UNAVAILABLE_NOT_FEASIBLE,
  CATEGORIES_UNAVAILABLE_UNKNOWN,
  CATEGORY_TO_STAGE_MAP,
  AnswerTypesEnum,
} from '@/lib/config/constants'
import { VariableCategoryEnum } from '@/types'

const Unavailable: FC = () => {
  const { t, i18n } = useTranslation('variables')
  const { watch, setValue } = useFormContext()

  const watchCategory: VariableCategoryEnum = watch('type')
  const watchAnswerType: number = parseInt(watch('answerType'))

  /**
   * Test if unavailable input should be displayed
   */
  const canDisplayUnavailableOption = useMemo(
    () => CATEGORIES_DISPLAYING_UNAVAILABLE_OPTION.includes(watchCategory),
    [watchCategory]
  )

  /**
   * Define label to display for unavailable options
   */
  const unavailableLabel = useMemo(() => {
    if (canDisplayUnavailableOption) {
      if (CATEGORIES_UNAVAILABLE_UNKNOWN.includes(watchCategory)) {
        return t('isUnavailable.unknown')
      }

      if (CATEGORIES_UNAVAILABLE_NOT_FEASIBLE.includes(watchCategory)) {
        return t('isUnavailable.unfeasible')
      }
    }
    setValue('isUnavailable', false)
    return t('isUnavailable.unavailable')
  }, [canDisplayUnavailableOption, watchCategory, i18n.language])

  /**
   * Set value of stage and answerType
   */
  useEffect(() => {
    if (watchCategory !== VariableCategoryEnum.BackgroundCalculation) {
      setValue('stage', CATEGORY_TO_STAGE_MAP[watchCategory])
    } else {
      setValue('stage', undefined)
    }

    if (
      [
        VariableCategoryEnum.ComplaintCategory,
        VariableCategoryEnum.Vaccine,
      ].includes(watchCategory)
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
    } else {
      setValue('answerType', watchAnswerType)
    }
  }, [watchCategory])

  if (canDisplayUnavailableOption) {
    return <Checkbox label={unavailableLabel} name='isUnavailable' />
  }

  return null
}

export default Unavailable
