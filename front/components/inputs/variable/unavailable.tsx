/**
 * The external imports
 */
import React, { useEffect, useMemo } from 'react'
import { useTranslation } from 'next-i18next'
import { useFormContext } from 'react-hook-form'

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
import type { UnavailableComponent } from '@/types'

const Unavailable: UnavailableComponent = ({ isDisabled }) => {
  const { t, i18n } = useTranslation('variables')
  const { watch, setValue } = useFormContext()

  const watchCategory: VariableCategoryEnum = watch('type')
  const watchAnswerTypeId: number = parseInt(watch('answerTypeId'))

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

      return t('isUnavailable.unavailable')
    }
    setValue('isUnavailable', false)
    return ''
  }, [canDisplayUnavailableOption, watchCategory, i18n.language])

  /**
   * Set value of stage and answerTypeId
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
    } else {
      setValue('answerTypeId', watchAnswerTypeId)
    }
  }, [watchCategory])

  if (canDisplayUnavailableOption) {
    return (
      <Checkbox
        label={unavailableLabel}
        name='isUnavailable'
        isDisabled={isDisabled}
      />
    )
  }

  return null
}

export default Unavailable
