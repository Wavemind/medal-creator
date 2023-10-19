/**
 * The external imports
 */
import React from 'react'
import { useTranslation } from 'next-i18next'
import { VStack } from '@chakra-ui/react'

/**
 * The internal imports
 */
import Input from '@/components/inputs/input'
import Textarea from '@/components/inputs/textarea'
import Checkbox from '@/components/inputs/checkbox'
import MessageRange from '@/components/inputs/variable/messageRange'
import Unavailable from '@/components/inputs/variable/unavailable'
import System from '@/components/inputs/variable/system'
import Category from '@/components/inputs/variable/category'
import AnswerType from '@/components/inputs/variable/answerType'
import Stage from '@/components/inputs/variable/stage'
import Formula from '@/components/inputs/variable/formula'
import ComplaintCategory from '@/components/inputs/variable/complaintCategory'
import Mandatory from '@/components/inputs/variable/mandatory'
import Round from '@/components/inputs/variable/round'
import EmergencyStatus from '@/components/inputs/variable/emergencyStatus'
import Placeholder from '@/components/inputs/variable/placeholder'
import PreFill from '@/components/inputs/variable/preFill'
import Estimable from '@/components/inputs/variable/estimable'
import { useProject } from '@/lib/hooks'
import type { VariableFormComponent } from '@/types'

const VariableForm: VariableFormComponent = ({
  projectId,
  isEdit,
  formEnvironment,
}) => {
  const { t } = useTranslation('variables')
  const { projectLanguage } = useProject()

  return (
    <VStack alignItems='flex-start' spacing={8}>
      <Category isDisabled={isEdit} formEnvironment={formEnvironment} />
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
          language: t(`languages.${projectLanguage}`, {
            ns: 'common',
            defaultValue: '',
          }),
          ns: 'common',
        })}
        isRequired
      />

      <ComplaintCategory projectId={projectId} restricted={true} />
      <Formula />
      <Round />
      <Placeholder />
      <MessageRange />

      <Textarea
        name='description'
        label={t('description')}
        helperText={t('helperText', {
          language: t(`languages.${projectLanguage}`, {
            ns: 'common',
            defaultValue: '',
          }),
          ns: 'common',
        })}
      />
    </VStack>
  )
}

export default VariableForm
