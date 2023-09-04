/**
 * The external imports
 */
import { useEffect, useMemo } from 'react'
import { useTranslation } from 'next-i18next'
import { Button, HStack, Spinner, VStack } from '@chakra-ui/react'
import { yupResolver } from '@hookform/resolvers/yup'
import { SubmitHandler, useForm } from 'react-hook-form'
import * as yup from 'yup'
import { skipToken } from '@reduxjs/toolkit/dist/query'

/**
 * The internal imports
 */
import FormProvider from '@/components/formProvider'
import Input from '@/components/inputs/input'
import Textarea from '@/components/inputs/textarea'
import Select from '@/components/inputs/select'
import { useGetProjectQuery } from '@/lib/api/modules/enhanced/project.enhanced'
import { useModal } from '@/lib/hooks'
import { HSTORE_LANGUAGES } from '@/lib/config/constants'
import { extractTranslation } from '@/lib/utils/string'
import {
  useCreateQuestionsSequenceMutation,
  useGetQuestionsSequenceQuery,
  useUpdateQuestionsSequenceMutation,
} from '@/lib/api/modules/enhanced/questionSequences.enhanced'
import ComplaintCategory from '@/components/inputs/variable/complaintCategory'
import CutOff from '@/components/inputs/cutOff'
import MinimalScore from '@/components/inputs/minimalScore'
import { QuestionsSequenceCategoryEnum } from '@/types'

import type {
  Languages,
  QuestionsSequenceComponent,
  QuestionsSequenceInputs,
} from '@/types'

const QuestionsSequenceForm: QuestionsSequenceComponent = ({
  projectId,
  questionsSequenceId,
  callback,
}) => {
  const { t } = useTranslation('questionsSequence')
  const { close } = useModal()

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

  const { data: project, isSuccess: isGetProjectSuccess } = useGetProjectQuery({
    id: projectId,
  })

  const methods = useForm<QuestionsSequenceInputs>({
    resolver: yupResolver(
      yup.object({
        label: yup.string().label(t('label')).required(),
        description: yup.string().nullable().label(t('description')),
        type: yup
          .mixed()
          .oneOf(Object.values(QuestionsSequenceCategoryEnum))
          .label(t('type'))
          .required(),
        complaintCategoryIds: yup.array().label(t('complaintCategories')),
        cutOffStart: yup
          .number()
          .transform(value => (isNaN(value) ? undefined : value))
          .nullable(),
        cutOffEnd: yup
          .number()
          .transform(value => (isNaN(value) ? undefined : value))
          .nullable(),
        minScore: yup
          .number()
          .nullable()
          .label(t('minScore'))
          .when('type', {
            is: (type: QuestionsSequenceCategoryEnum) =>
              type === QuestionsSequenceCategoryEnum.Scored,
            then: schema => schema.required(),
          }),
      })
    ),
    reValidateMode: 'onSubmit',
    defaultValues: {
      label: '',
      description: '',
      type: undefined,
      complaintCategoryOptions: undefined,
      cutOffStart: null,
      cutOffEnd: null,
      minScore: null,
    },
  })

  useEffect(() => {
    if (isGetQSSuccess && isGetProjectSuccess) {
      methods.reset({
        label: extractTranslation(
          questionsSequence.labelTranslations,
          project.language.code
        ),
        description: extractTranslation(
          questionsSequence.descriptionTranslations,
          project.language.code
        ),
        type: questionsSequence.type,
        cutOffStart: questionsSequence.cutOffStart,
        cutOffEnd: questionsSequence.cutOffEnd,
        minScore: questionsSequence.minScore,
        complaintCategoryOptions:
          questionsSequence.nodeComplaintCategories?.map(NCC => ({
            value: String(NCC.complaintCategory.id),
            label: extractTranslation(
              NCC.complaintCategory.labelTranslations,
              project.language.code
            ),
          })),
      })
    }
  }, [isGetQSSuccess])

  const onSubmit: SubmitHandler<QuestionsSequenceInputs> = data => {
    const tmpData = { ...data }
    const descriptionTranslations: Languages = {}
    const labelTranslations: Languages = {}
    HSTORE_LANGUAGES.forEach(language => {
      descriptionTranslations[language] =
        language === project?.language.code && tmpData.description
          ? tmpData.description
          : ''
    })
    HSTORE_LANGUAGES.forEach(language => {
      labelTranslations[language] =
        language === project?.language.code && tmpData.label
          ? tmpData.label
          : ''
    })

    const complaintCategoryIds = tmpData.complaintCategoryOptions?.map(
      cc => cc.value
    )

    delete tmpData.description
    delete tmpData.label
    delete tmpData.complaintCategoryOptions

    if (questionsSequenceId) {
      updateQuestionsSequence({
        id: questionsSequenceId,
        labelTranslations,
        descriptionTranslations,
        complaintCategoryIds,
        ...tmpData,
      })
    } else {
      createQuestionsSequence({
        labelTranslations,
        descriptionTranslations,
        projectId,
        complaintCategoryIds,
        ...tmpData,
      })
    }
  }

  const handleSuccess = () => {
    const nodeToReturn = updatedQS || newQS

    if (callback && nodeToReturn) {
      callback(nodeToReturn)
    }

    close()
  }

  if (isGetProjectSuccess) {
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
              isDisabled={questionsSequenceId}
            />
            <Input
              name='label'
              label={t('label')}
              isRequired
              helperText={t('helperText', {
                language: t(`languages.${project.language.code}`, {
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
                language: t(`languages.${project.language.code}`, {
                  ns: 'common',
                  defaultValue: '',
                }),
                ns: 'common',
              })}
            />
            <ComplaintCategory projectId={projectId} restricted={false} />
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

  return <Spinner size='xl' />
}

export default QuestionsSequenceForm
