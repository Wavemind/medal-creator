/**
 * The external imports
 */
import React, { useEffect } from 'react'
import { useTranslation } from 'next-i18next'
import { useFormContext } from 'react-hook-form'
import { Divider } from '@chakra-ui/react'

/**
 * The internal imports
 */
import Textarea from '@/components/inputs/textarea'
import Number from '@/components/inputs/number'
import { NUMERIC_ANSWER_TYPES } from '@/lib/config/constants'
import { useProject } from '@/lib/hooks/useProject'
import type { MessageRangeComponent } from '@/types'

const MessageRange: MessageRangeComponent = () => {
  const { t } = useTranslation('variables')
  const { watch, setValue } = useFormContext()

  const { projectLanguage } = useProject()

  const watchAnswerType: number = parseInt(watch('answerTypeId'))
  const watchMinValueWarning: string = watch('minValueWarning')
  const watchMaxValueWarning: string = watch('maxValueWarning')
  const watchMinValueError: string = watch('minValueError')
  const watchMaxValueError: string = watch('maxValueError')

  /**
   * Clear inputs
   */
  useEffect(() => {
    if (!NUMERIC_ANSWER_TYPES.includes(watchAnswerType)) {
      setValue('minValueWarning', '')
      setValue('maxValueWarning', '')
      setValue('minValueError', '')
      setValue('maxValueError', '')
    }
  }, [watchAnswerType])

  useEffect(() => {
    if (watchMinValueWarning === '') {
      setValue('minMessageWarning', undefined)
    }
  }, [watchMinValueWarning])

  useEffect(() => {
    if (watchMaxValueWarning === '') {
      setValue('maxMessageWarning', undefined)
    }
  }, [watchMaxValueWarning])

  useEffect(() => {
    if (watchMinValueError === '') {
      setValue('minMessageError', undefined)
    }
  }, [watchMinValueError])

  useEffect(() => {
    if (watchMaxValueError === '') {
      setValue('maxMessageError', undefined)
    }
  }, [watchMaxValueError])

  if (NUMERIC_ANSWER_TYPES.includes(watchAnswerType)) {
    return (
      <React.Fragment>
        <Number name='minValueWarning' label={t('minValueWarning')} />
        {watchMinValueWarning && (
          <React.Fragment>
            <Textarea
              name='minMessageWarning'
              label={t('minMessageWarning')}
              isRequired
              helperText={t('helperText', {
                language: t(`languages.${projectLanguage}`, {
                  ns: 'common',
                  defaultValue: '',
                }),
                ns: 'common',
              })}
            />
            <Divider />
          </React.Fragment>
        )}

        <Number name='maxValueWarning' label={t('maxValueWarning')} />
        {watchMaxValueWarning && (
          <React.Fragment>
            <Textarea
              name='maxMessageWarning'
              label={t('maxMessageWarning')}
              isRequired
              helperText={t('helperText', {
                language: t(`languages.${projectLanguage}`, {
                  ns: 'common',
                  defaultValue: '',
                }),
                ns: 'common',
              })}
            />
            <Divider />
          </React.Fragment>
        )}

        <Number name='minValueError' label={t('minValueError')} />
        {watchMinValueError && (
          <React.Fragment>
            <Textarea
              name='minMessageError'
              label={t('minMessageError')}
              isRequired
              helperText={t('helperText', {
                language: t(`languages.${projectLanguage}`, {
                  ns: 'common',
                  defaultValue: '',
                }),
                ns: 'common',
              })}
            />
            <Divider />
          </React.Fragment>
        )}

        <Number name='maxValueError' label={t('maxValueError')} />
        {watchMaxValueError && (
          <Textarea
            name='maxMessageError'
            label={t('maxMessageError')}
            isRequired
            helperText={t('helperText', {
              language: t(`languages.${projectLanguage}`, {
                ns: 'common',
                defaultValue: '',
              }),
              ns: 'common',
            })}
          />
        )}
      </React.Fragment>
    )
  }

  return null
}

export default MessageRange
