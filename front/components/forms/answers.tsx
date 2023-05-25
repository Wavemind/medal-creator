/**
 * The external imports
 */
import React from 'react'
import { Button, VStack, Spinner, Text } from '@chakra-ui/react'
import { useTranslation } from 'next-i18next'
import { useFieldArray, useFormContext } from 'react-hook-form'
import get from 'lodash/get'

import { AnswerLine } from '@/components'
import type { AnswerComponent } from '@/types'

// TODO : Enlever les champs non-utilisés lorsqu'on switch l'operator entre between et les autres
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

  console.log(error)

  const handleAppend = () => append({ isUnavailable: false })
  const handleRemove = (index: number) => remove(index)

  return (
    <VStack spacing={8}>
      <VStack spacing={6}>
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
      {error?.message && <Text>{error.message}</Text>}
      <Button onClick={handleAppend} w='full'>
        {t('add', { ns: 'common' })}
      </Button>
    </VStack>
  )
}

export default Answers
