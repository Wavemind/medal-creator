/**
 * The external imports
 */
import React, { useEffect } from 'react'
import { useTranslation } from 'next-i18next'
import { useFormContext } from 'react-hook-form'

/**
 * The internal imports
 */
import Input from '@/components/inputs/input'
import { INPUT_ANSWER_TYPES } from '@/lib/config/constants'
import { useGetProjectQuery } from '@/lib/api/modules/enhanced/project.enhanced'
import type { PlaceholderComponent } from '@/types'

const Placeholder: PlaceholderComponent = ({ projectId }) => {
  const { t } = useTranslation('variables')

  const { watch, setValue, getValues } = useFormContext()
  const watchAnswerTypeId: string = watch('answerTypeId')

  const { data: project, isSuccess: isGetProjectSuccess } = useGetProjectQuery({
    id: projectId,
  })

  useEffect(() => {
    if (
      !INPUT_ANSWER_TYPES.includes(parseInt(watchAnswerTypeId)) &&
      getValues('placeholder')
    ) {
      setValue('round', undefined)
    }
  }, [watchAnswerTypeId])

  if (
    INPUT_ANSWER_TYPES.includes(parseInt(watchAnswerTypeId)) &&
    isGetProjectSuccess
  ) {
    return (
      <Input
        label={t('placeholder')}
        name='placeholder'
        helperText={t('helperText', {
          language: t(`languages.${project.language.code}`, {
            ns: 'common',
            defaultValue: '',
          }),
          ns: 'common',
        })}
      />
    )
  }

  return null
}

export default Placeholder
