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
import { Select } from '@/components'
import { VariableService } from '@/lib/services'
import { DISPLAY_ROUND_ANSWER_TYPE } from '@/lib/config/constants'

const Round: FC = () => {
  const { t } = useTranslation('variables')
  const { watch, getValues, setValue } = useFormContext()

  const watchAnswerType: string = watch('answerType')

  const rounds = useMemo(
    () =>
      VariableService.rounds.map(round => ({
        value: round,
        label: t(`rounds.${round}`, { defaultValue: '' }),
      })),
    [t]
  )

  useEffect(() => {
    if (
      !DISPLAY_ROUND_ANSWER_TYPE.includes(parseInt(watchAnswerType)) &&
      getValues('round')
    ) {
      setValue('round', undefined)
    }
  }, [watchAnswerType])

  if (DISPLAY_ROUND_ANSWER_TYPE.includes(parseInt(watchAnswerType))) {
    return <Select label={t('round')} options={rounds} name='round' />
  }

  return null
}

export default Round
