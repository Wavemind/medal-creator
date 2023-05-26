/**
 * The external imports
 */
import React from 'react'
import { Button, VStack, Alert, AlertIcon, AlertTitle } from '@chakra-ui/react'
import { useTranslation } from 'next-i18next'
import { useFieldArray, useFormContext } from 'react-hook-form'
import get from 'lodash/get'

/**
 * The internal imports
 */
import { AnswerLine } from '@/components'
import type { AnswerComponent } from '@/types'

const Answers: AnswerComponent = ({ projectId }) => {
  const { t } = useTranslation('variables')
  const {
    control,
    formState: { errors },
  } = useFormContext()

  const { fields, append, remove } = useFieldArray({
    control,
    name: 'answersAttributes',
  })

  const error = get(errors, 'overlap')

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
      {error?.message && (
        <Alert status='error'>
          <AlertIcon />
          <AlertTitle>{error.message}</AlertTitle>
        </Alert>
      )}
      <Button onClick={handleAppend} w='full'>
        {t('add', { ns: 'common' })}
      </Button>
    </VStack>
  )
}

export default Answers
