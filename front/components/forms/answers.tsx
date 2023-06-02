/**
 * The external imports
 */
import React, { useEffect, useMemo } from 'react'
import { Button, VStack } from '@chakra-ui/react'
import { useTranslation } from 'next-i18next'
import { useFieldArray, useFormContext } from 'react-hook-form'
import get from 'lodash/get'

/**
 * The internal imports
 */
import { AnswerLine, ErrorMessage } from '@/components'
import type { AnswerComponent } from '@/types'
import { OperatorsEnum } from '@/lib/config/constants'
import { useGetProjectQuery } from '@/lib/api/modules'

const Answers: AnswerComponent = ({ projectId, existingAnswers }) => {
  const { t } = useTranslation('variables')
  const {
    control,
    clearErrors,
    formState: { errors },
  } = useFormContext()

  const overlapError = get(errors, 'overlap')
  const answersAttributesError = get(errors, 'answersAttributes')

  const { fields, append, remove, update } = useFieldArray({
    control,
    name: 'answersAttributes',
  })

  const { data: project, isSuccess: isProjectSuccess } =
    useGetProjectQuery(projectId)

  useEffect(() => {
    clearErrors(['answersAttributes', 'overlap'])
  }, [])

  useEffect(() => {
    if (existingAnswers && isProjectSuccess) {
      console.log('je rentre')
      existingAnswers.forEach((answer, index) => {
        console.log(answer.value)
        // TODO HOW WE DEAL WITH NOT_AVAILABLE
        if (answer.operator === OperatorsEnum.Between && answer.value) {
          const splittedValue = answer.value.split(',')
          update(index, {
            id: answer.id,
            label: answer.labelTranslations[project.language.code],
            operator: answer.operator,
            startValue: splittedValue[0],
            endValue: splittedValue[1],
          })
        } else {
          update(index, {
            id: answer.id,
            label: answer.labelTranslations[project.language.code],
            operator: answer.operator,
            value: answer.value,
          })
        }
      })
    }
  }, [])

  /**
   * Single point of error. Fetched from yup or custom
   */
  const error = useMemo(() => {
    if (answersAttributesError?.message) {
      return answersAttributesError.message
    }

    if (overlapError?.message) {
      return overlapError.message
    }

    return null
  }, [overlapError, answersAttributesError])

  const handleAppend = () => append({ label: '' })
  const handleRemove = (index: number) => remove(index)

  return (
    <VStack spacing={8}>
      <VStack spacing={6} w='full'>
        {fields.map((field, index) => (
          <AnswerLine
            key={field.id}
            field={field}
            index={index}
            projectId={projectId}
            handleRemove={handleRemove}
          />
        ))}
      </VStack>
      {error && <ErrorMessage error={error} />}
      <Button onClick={handleAppend} w='full'>
        {t('add', { ns: 'common' })}
      </Button>
    </VStack>
  )
}

export default Answers
