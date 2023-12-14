/**
 * The external imports
 */
import { useEffect, FC } from 'react'
import { useFormContext } from 'react-hook-form'
import { useTranslation } from 'next-i18next'

/**
 * The internal imports
 */
import Number from '@/components/inputs/number'
import { IsDisabled, QuestionsSequenceCategoryEnum } from '@/types'

const MinimalScore: FC<IsDisabled> = ({ isDisabled = false }) => {
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
