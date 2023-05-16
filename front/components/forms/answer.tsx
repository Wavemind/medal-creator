/**
 * The external imports
 */
import {
  Button,
  HStack,
  IconButton,
  VStack,
  Spinner,
  useConst,
} from '@chakra-ui/react'
import { useTranslation } from 'next-i18next'

/**
 * The internal imports
 */
import { DeleteIcon } from '@/assets/icons'
import { Input, Select } from '@/components'
import { useGetProjectQuery } from '@/lib/api/modules'
import { VariableService } from '@/lib/services'
import { useFieldArray, useFormContext } from 'react-hook-form'
import type { AnswerComponent } from '@/types'

const Answer: AnswerComponent = ({ projectId }) => {
  const { t } = useTranslation('variables')
  const { control, watch } = useFormContext()
  const watchAnswerType: number = parseInt(watch('answerType'))

  const { fields, remove, append } = useFieldArray({
    control,
    name: 'answersAttributes',
  })

  const { data: project, isSuccess: isGetProjectSuccess } =
    useGetProjectQuery(projectId)

  const operators = useConst(() =>
    VariableService.operators.map(operator => ({
      value: operator,
      label: t(`answer.operators.${operator}`, { defaultValue: '' }),
    }))
  )

  const handleAppend = () =>
    append({
      isUnavailable: false,
    })

  if (isGetProjectSuccess) {
    return (
      <VStack spacing={8}>
        <VStack spacing={6}>
          {fields.map((field, index) => (
            <HStack key={field.id} alignItems='flex-end'>
              <Input
                name={`answersAttributes[${index}].label`}
                label={t('answer.label')}
                helperText={t('helperText', {
                  language: t(`languages.${project.language.code}`, {
                    ns: 'common',
                    defaultValue: '',
                  }),
                  ns: 'common',
                })}
                isRequired
              />

              <Select
                label={t('answer.operator')}
                options={operators}
                name={`answersAttributes[${index}].operator`}
              />
              <Input
                name={`answersAttributes[${index}].value`}
                label={t('answer.value')}
                isRequired
              />
              <IconButton
                aria-label='delete'
                icon={<DeleteIcon />}
                variant='ghost'
                onClick={() => remove(index)}
              />
            </HStack>
          ))}
        </VStack>
        <Button onClick={handleAppend} w='full'>
          {t('add', { ns: 'common' })}
        </Button>
      </VStack>
    )
  }

  return <Spinner />
}

export default Answer
