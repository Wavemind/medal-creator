/**
 * The external imports
 */
import React, { useEffect } from 'react'
import { useFormContext } from 'react-hook-form'
import { useTranslation } from 'next-i18next'

/**
 * The internal imports
 */
import Number from '@/components/inputs/number'
import { QuestionsSequenceCategoryEnum } from '@/types'

const MinimalScore = ({ isDisabled = false }: { isDisabled?: boolean }) => {
  const { t } = useTranslation('questionsSequence')
  const { watch, setValue } = useFormContext()

  const watchCategory: QuestionsSequenceCategoryEnum = watch('type')

  useEffect(() => {
    if (watchCategory !== QuestionsSequenceCategoryEnum.Scored) {
      setValue('minScore', null)
    }
  }, [watchCategory])

  if (watchCategory === QuestionsSequenceCategoryEnum.Scored) {
    return (
      <Number
        name='minScore'
        label={t('minScore')}
        isRequired
        isDisabled={isDisabled}
      />
    )
  }

  return null
}

export default MinimalScore
