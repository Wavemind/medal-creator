/**
 * The external imports
 */
import React, { useEffect } from 'react'
import { useTranslation } from 'next-i18next'
import { useConst } from '@chakra-ui/react'
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

  const watchAnswerTypeId: string = watch('answerTypeId')

  const rounds = useConst(() =>
    VariableService.rounds.map(round => ({
      value: round,
      label: t(`rounds.${round}`, { defaultValue: '' }),
    }))
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
