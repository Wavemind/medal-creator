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
import {
  Textarea,
  Number,
} from '@/components'
import {
  useGetProjectQuery,
} from '@/lib/api/modules'
import type { MessageRangeComponent } from '@/types'
import { NUMERIC_ANSWER_TYPES } from '@/lib/config/constants'

const MessageRange: MessageRangeComponent = ({ projectId }) => {
  const { t } = useTranslation('variables')
  const { watch, setValue } = useFormContext()

  const watchAnswerType: number = parseInt(watch('answerType'))
  const watchMinValueWarning: string = watch('minValueWarning')
  const watchMaxValueWarning: string = watch('maxValueWarning')
  const watchMinValueError: string = watch('minValueError')
  const watchMaxValueError: string = watch('maxValueError')

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

  const { data: project } =
    useGetProjectQuery(projectId)


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
                language: t(`languages.${project?.language.code}`, {
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
                language: t(`languages.${project?.language.code}`, {
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
                language: t(`languages.${project?.language.code}`, {
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
              language: t(`languages.${project?.language.code}`, {
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
