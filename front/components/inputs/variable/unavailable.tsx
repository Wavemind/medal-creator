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
  VariableTypesEnum,
  AnswerTypesEnum,
} from '@/lib/config/constants'

const Unavailable: FC = () => {
  const { t, i18n } = useTranslation('variables')
  const { watch, setValue } = useFormContext()

  const watchCategory: VariableTypesEnum = watch('type')
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
    console.log('canDisplayUnavailableOption', canDisplayUnavailableOption)
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
   * Set value of stage and answerType
   */
  useEffect(() => {
    if (watchCategory !== VariableTypesEnum.BackgroundCalculation) {
      setValue('stage', CATEGORY_TO_STAGE_MAP[watchCategory])
    } else {
      setValue('stage', undefined)
    }

    if (
      [VariableTypesEnum.ComplaintCategory, VariableTypesEnum.Vaccine].includes(
        watchCategory
      )
    ) {
      setValue('answerType', AnswerTypesEnum.RadioBoolean)
    } else if (
      [
        VariableTypesEnum.BasicMeasurement,
        VariableTypesEnum.VitalSignAnthropometric,
      ].includes(watchCategory)
    ) {
      setValue('answerType', AnswerTypesEnum.InputFloat)
    } else if (watchCategory === VariableTypesEnum.BackgroundCalculation) {
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
