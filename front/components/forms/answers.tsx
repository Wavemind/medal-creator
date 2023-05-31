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

const Answers: AnswerComponent = ({ projectId }) => {
  const { t } = useTranslation('variables')
  const {
    control,
    clearErrors,
    formState: { errors },
  } = useFormContext()

  const { fields, append, remove } = useFieldArray({
    control,
    name: 'answersAttributes',
  })

  useEffect(() => {
    clearErrors(['answersAttributes', 'overlap'])
  }, [])

  const overlapError = get(errors, 'overlap')
  const answersAttributesError = get(errors, 'answersAttributes')

  const error = useMemo(() => {
    if (answersAttributesError?.message) {
      return answersAttributesError.message
    }

    if (overlapError?.message) {
      return overlapError.message
    }

    return null
  }, [overlapError, answersAttributesError])

  const handleAppend = () => append({ isUnavailable: false })
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
