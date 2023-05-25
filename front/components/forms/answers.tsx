/**
 * The external imports
 */
import React from 'react'
import { Button, VStack, Spinner } from '@chakra-ui/react'
import { useTranslation } from 'next-i18next'
import { useFieldArray, useFormContext } from 'react-hook-form'

import { AnswerLine } from '@/components'
import type { AnswerComponent } from '@/types'

// TODO : Enlever les champs non-utilisés lorsqu'on switch l'operator entre between et les autres
const Answers: AnswerComponent = ({ projectId }) => {
  const { t } = useTranslation('variables')
  const { control } = useFormContext()

  const { fields, append } = useFieldArray({
    control,
    name: 'answersAttributes',
  })

  const handleAppend = () =>
    append({ isUnavailable: false })

  return (
    <VStack spacing={8}>
      <VStack spacing={6}>
        {fields.map((field, index) => (
          <AnswerLine field={field} index={index} projectId={projectId} />
        ))}
      </VStack>
      <Button onClick={handleAppend} w='full'>
        {t('add', { ns: 'common' })}
      </Button>
    </VStack>
  )

  return <Spinner />
}

export default Answers
