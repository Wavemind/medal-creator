/**
 * The external imports
 */
import React from 'react'
import { useTranslation } from 'next-i18next'
import { VStack, Spinner } from '@chakra-ui/react'

/**
 * The internal imports
 */
import {
  Input,
  Textarea,
  Checkbox,
  MessageRange,
  Unavailable,
  System,
  Category,
  AnswerType,
  Stage,
  Formula,
  ComplaintCategory,
  Mandatory,
  Round,
  EmergencyStatus,
  Placeholder,
  PreFill,
  Estimable,
} from '@/components'
import { useGetProjectQuery } from '@/lib/api/modules'
import type { VariableFormComponent } from '@/types'

const VariableForm: VariableFormComponent = ({ projectId, isEdit }) => {
  const { t } = useTranslation('variables')

  const { data: project, isSuccess: isGetProjectSuccess } =
    useGetProjectQuery(projectId)

  if (isGetProjectSuccess) {
    return (
      <VStack alignItems='flex-start' spacing={8}>
        <Category isDisabled={isEdit} />
        <AnswerType isDisabled={isEdit} />
        <Stage />
        <System />
        <EmergencyStatus />
        <Mandatory />
        <Checkbox label={t('isNeonat')} name='isNeonat' />
        <Unavailable isDisabled={isEdit} />
        <PreFill />

        <Checkbox label={t('isIdentifiable')} name='isIdentifiable' />

        <Estimable />

        <Input
          name='label'
          label={t('label')}
          helperText={t('helperText', {
            language: t(`languages.${project.language.code}`, {
              ns: 'common',
              defaultValue: '',
            }),
            ns: 'common',
          })}
          isRequired
        />

        <ComplaintCategory projectId={projectId} />
        <Formula />
        <Round />
        <Placeholder projectId={projectId} />
        <MessageRange projectId={projectId} />

        <Textarea
          name='description'
          label={t('description')}
          helperText={t('helperText', {
            language: t(`languages.${project.language.code}`, {
              ns: 'common',
              defaultValue: '',
            }),
            ns: 'common',
          })}
        />
      </VStack>
    )
  }

  return <Spinner size='xl' />
}

export default VariableForm
