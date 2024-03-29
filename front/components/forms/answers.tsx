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
import AnswerLine from '@/components/inputs/variable/answerLine'
import ErrorMessage from '@/components/errorMessage'
import type { AnswerComponent, VariableInputsForm } from '@/types'

const Answers: AnswerComponent = ({ isRestricted }) => {
  const { t } = useTranslation('variables')
  const {
    control,
    clearErrors,
    setError,
    formState: { errors },
  } = useFormContext<VariableInputsForm>()

  const answersAttributesError = get(errors, 'answersAttributes')

  const { fields, append, remove, update } = useFieldArray({
    control,
    name: 'answersAttributes',
  })

  /**
   * Reset errors
   */
  useEffect(() => {
    setError('root', {})
    clearErrors(['answersAttributes'])
  }, [])

  /**
   * Single point of error. Fetched from yup or custom
   */
  const error = useMemo(() => {
    if (answersAttributesError?.message) {
      return answersAttributesError.message
    }

    // Display overlap message
    if (errors.root) {
      return errors.root.message
    }

    return null
  }, [errors.root, answersAttributesError])

  /**
   * Add new answer
   */
  const handleAppend = (): void =>
    append({
      label: '',
      _destroy: false,
      value: '',
    })

  /**
   * Remove answer in creation or add _destroy in update mode
   * @param answer position in fields array
   */
  const handleRemove = (index: number): void => {
    const currentField = fields[index]

    // Check if answerId exist in currentField
    if (Object.prototype.hasOwnProperty.call(currentField, 'answerId')) {
      update(index, { ...currentField, _destroy: true })
    } else {
      remove(index)
    }
  }

  return (
    <VStack spacing={8}>
      <VStack spacing={6} w='full'>
        {fields.map((field, index) => {
          if (!field._destroy) {
            return (
              <AnswerLine
                key={field.id}
                field={field}
                index={index}
                handleRemove={handleRemove}
                isRestricted={isRestricted}
              />
            )
          }
        })}
      </VStack>
      {error && <ErrorMessage error={error} />}
      <Button
        onClick={handleAppend}
        w='full'
        data-testid='add-answer'
        isDisabled={isRestricted}
      >
        {t('add', { ns: 'common' })}
      </Button>
    </VStack>
  )
}

export default Answers
