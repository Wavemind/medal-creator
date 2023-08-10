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
import Select from '../select'
import VariableService from '@/lib/services/variable.service'
import { DISPLAY_ROUND_ANSWER_TYPE } from '@/lib/config/constants'

const Round: FC = () => {
  const { t } = useTranslation('variables')
  const { watch, getValues, setValue } = useFormContext()

  const watchAnswerTypeId: string = watch('answerTypeId')

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
      !DISPLAY_ROUND_ANSWER_TYPE.includes(parseInt(watchAnswerTypeId)) &&
      getValues('round')
    ) {
      setValue('round', undefined)
    }
  }, [watchAnswerTypeId])

  if (DISPLAY_ROUND_ANSWER_TYPE.includes(parseInt(watchAnswerTypeId))) {
    return <Select label={t('round')} options={rounds} name='round' />
  }

  return null
}

export default Round
