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
import { FormulaInformation, Input } from '@/components'
import { DISPLAY_FORMULA_ANSWER_TYPE } from '@/lib/config/constants'

const Formula: FC = () => {
  const { t } = useTranslation('variables')

  const { watch, setValue, getValues } = useFormContext()
  const watchAnswerType: string = watch('answerType')

  useEffect(() => {
    if (
      !DISPLAY_FORMULA_ANSWER_TYPE.includes(parseInt(watchAnswerType)) &&
      getValues('formula')
    ) {
      setValue('formula', undefined)
    }
  }, [watchAnswerType])

  if (DISPLAY_FORMULA_ANSWER_TYPE.includes(parseInt(watchAnswerType))) {
    return (
      <Input
        label={t('formula')}
        name='formula'
        isRequired
        hasDrawer
        drawerContent={<FormulaInformation />}
        drawerTitle={t('formulaInformation.formulaTooltipTitle')}
      />
    )
  }

  return null
}

export default Formula