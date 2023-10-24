/**
 * The external imports
 */
import { useEffect, useMemo } from 'react'
import { useTranslation } from 'next-i18next'
import { Button, HStack, VStack } from '@chakra-ui/react'
import { yupResolver } from '@hookform/resolvers/yup'
import { SubmitHandler, useForm } from 'react-hook-form'
import { skipToken } from '@reduxjs/toolkit/dist/query'

/**
 * The internal imports
 */
import FormProvider from '@/components/formProvider'
import Input from '@/components/inputs/input'
import Textarea from '@/components/inputs/textarea'
import Select from '@/components/inputs/select'
import { useAppRouter, useModal, useProject } from '@/lib/hooks'
import QuestionsSequenceService from '@/lib/services/questionsSequence.service'
import {
  useCreateQuestionsSequenceMutation,
  useGetQuestionsSequenceQuery,
  useUpdateQuestionsSequenceMutation,
} from '@/lib/api/modules/enhanced/questionSequences.enhanced'
import ComplaintCategory from '@/components/inputs/variable/complaintCategory'
import CutOff from '@/components/inputs/cutOff'
import MinimalScore from '@/components/inputs/minimalScore'
import { CutOffValueTypesEnum, QuestionsSequenceCategoryEnum } from '@/types'
import type {
  QuestionsSequenceComponent,
  QuestionsSequenceInputs,
} from '@/types'

const QuestionsSequenceForm: QuestionsSequenceComponent = ({
  questionsSequenceId,
  callback,
}) => {
  const { t } = useTranslation('questionsSequence')
  const { close } = useModal()
  const { projectLanguage } = useProject()
  const {
    query: { projectId },
  } = useAppRouter()

  const type = useMemo(() => {
    return Object.values(QuestionsSequenceCategoryEnum).map(qs => ({
      value: qs,
      label: t(`categories.${qs}.label`, { ns: 'variables', defaultValue: '' }),
    }))
  }, [t])

  const [
    createQuestionsSequence,
    {
      data: newQS,
      isSuccess: isCreateQSSuccess,
      isError: isCreateQSError,
      error: createQSError,
      isLoading: isCreateQSLoading,
    },
  ] = useCreateQuestionsSequenceMutation()

  const [
    updateQuestionsSequence,
    {
      data: updatedQS,
      isSuccess: isUpdateQSSuccess,
      isError: isUpdateQSError,
      error: updateQSError,
      isLoading: isUpdateQSLoading,
    },
  ] = useUpdateQuestionsSequenceMutation()

  const {
    data: questionsSequence,
    isSuccess: isGetQSSuccess,
    isError: isGetQSError,
    error: getQSError,
  } = useGetQuestionsSequenceQuery(
    questionsSequenceId ? { id: questionsSequenceId } : skipToken
  )

  const methods = useForm<QuestionsSequenceInputs>({
    resolver: yupResolver(QuestionsSequenceService.getValidationSchema(t)),
    reValidateMode: 'onSubmit',
    defaultValues: {
      label: '',
      description: '',
      type: undefined,
      complaintCategoryOptions: undefined,
      cutOffValueType: CutOffValueTypesEnum.Days,
      cutOffStart: null,
      cutOffEnd: null,
      minScore: null,
    },
  })

  useEffect(() => {
    if (isGetQSSuccess) {
      methods.reset(
        QuestionsSequenceService.buildFormData(
          questionsSequence,
          projectLanguage
        )
      )
    }
  }, [isGetQSSuccess, questionsSequence])

  const onSubmit: SubmitHandler<QuestionsSequenceInputs> = data => {
    const transformedData = QuestionsSequenceService.transformData(
      data,
      projectLanguage
    )

    if (questionsSequenceId) {
      updateQuestionsSequence({
        ...transformedData,
        id: questionsSequenceId,
      })
    } else {
      createQuestionsSequence({
        ...transformedData,
        projectId,
      })
    }
  }

  const handleSuccess = () => {
    const nodeToReturn = updatedQS || newQS

    if (callback && nodeToReturn) {
      callback({
        id: nodeToReturn.id,
        fullReference: nodeToReturn.fullReference,
        isNeonat: false,
        labelTranslations: nodeToReturn.labelTranslations,
        category: nodeToReturn.category,
        diagramAnswers: nodeToReturn.diagramAnswers,
        excludingNodes: [],
      })
    }

    close()
  }

  return (
    <FormProvider<QuestionsSequenceInputs>
      methods={methods}
      isError={isCreateQSError || isUpdateQSError || isGetQSError}
      error={{ ...createQSError, ...updateQSError, ...getQSError }}
      isSuccess={isCreateQSSuccess || isUpdateQSSuccess}
      callbackAfterSuccess={handleSuccess}
    >
      <form onSubmit={methods.handleSubmit(onSubmit)}>
        <VStack align='left' spacing={8}>
          <Select
            label={t('type')}
            options={type}
            name='type'
            isRequired
            isDisabled={!!questionsSequenceId}
          />
          <Input
            name='label'
            label={t('label')}
            isRequired
            helperText={t('helperText', {
              language: t(`languages.${projectLanguage}`, {
                ns: 'common',
                defaultValue: '',
              }),
              ns: 'common',
            })}
          />
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
          <ComplaintCategory restricted={false} />
          <CutOff />
          <MinimalScore />
          <HStack justifyContent='flex-end'>
            <Button
              type='submit'
              data-testid='submit'
              mt={6}
              isLoading={isCreateQSLoading || isUpdateQSLoading}
            >
              {t('save', { ns: 'common' })}
            </Button>
          </HStack>
        </VStack>
      </form>
    </FormProvider>
  )
}

export default QuestionsSequenceForm
