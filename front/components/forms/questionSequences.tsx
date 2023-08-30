/**
 * The external imports
 */
import { useEffect, useMemo } from 'react'
import { useTranslation } from 'next-i18next'
import { Box, Button, HStack, Spinner, VStack } from '@chakra-ui/react'
import { yupResolver } from '@hookform/resolvers/yup'
import { SubmitHandler, useForm } from 'react-hook-form'
import * as yup from 'yup'
import { skipToken } from '@reduxjs/toolkit/dist/query'

/**
 * The internal imports
 */
import ErrorMessage from '@/components/errorMessage'
import FormProvider from '@/components/formProvider'
import Input from '@/components/inputs/input'
import Textarea from '@/components/inputs/textarea'
import Select from '@/components/inputs/select'
import { useGetProjectQuery } from '@/lib/api/modules/enhanced/project.enhanced'
import { useModal, useToast } from '@/lib/hooks'
import { HSTORE_LANGUAGES } from '@/lib/config/constants'
import { extractTranslation } from '@/lib/utils/string'
import { useCreateQuestionsSequenceMutation } from '@/lib/api/modules/enhanced/questionSequences.enhanced'
import ComplaintCategory from '@/components/inputs/variable/complaintCategory'
import CutOff from '@/components/inputs/cutOff'
import {
  Languages,
  QuestionSequencesComponent,
  QuestionSequencesInputs,
  QuestionsSequenceCategoryEnum,
} from '@/types'

const QuestionSequencesForm: QuestionSequencesComponent = ({
  projectId,
  questionsSequenceId,
}) => {
  const { t } = useTranslation('questionsSequence')
  const { newToast } = useToast()
  const { close } = useModal()

  /**
   * Change system options based on category selected
   */
  const type = useMemo(() => {
    return Object.values(QuestionsSequenceCategoryEnum).map(qs => ({
      value: qs,
      label: t(`categories.${qs}.label`, { ns: 'variables', defaultValue: '' }),
    }))
  }, [t])

  const [
    createQuestionsSequence,
    {
      isSuccess: isCreateQSSuccess,
      isError: isCreateQSError,
      error: createQSError,
      isLoading: isCreateQSLoading,
    },
  ] = useCreateQuestionsSequenceMutation()

  // const {
  //   data: management,
  //   isSuccess: isGetManagementSuccess,
  //   isError: isGetManagementError,
  //   error: getManagementError,
  // } = useGetManagementQuery(managementId ? { id: managementId } : skipToken)

  // const [
  //   createManagement,
  //   {
  //     isSuccess: isCreateManagementSuccess,
  //     isError: isCreateManagementError,
  //     error: createManagementError,
  //     isLoading: isCreateManagementLoading,
  //   },
  // ] = useCreateManagementMutation()

  // const [
  //   updateManagement,
  //   {
  //     isSuccess: isUpdateManagementSuccess,
  //     isError: isUpdateManagementError,
  //     error: updateManagementError,
  //     isLoading: isUpdateManagementLoading,
  //   },
  // ] = useUpdateManagementMutation()

  const { data: project, isSuccess: isGetProjectSuccess } = useGetProjectQuery({
    id: projectId,
  })

  const methods = useForm<QuestionSequencesInputs>({
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

  // TODO FIX IT

  // useEffect(() => {
  //   if (isGetManagementSuccess && isGetProjectSuccess) {
  //     methods.reset({
  //       label: extractTranslation(
  //         management.labelTranslations,
  //         project.language.code
  //       ),
  //       description: extractTranslation(
  //         management.descriptionTranslations,
  //         project.language.code
  //       ),
  //       levelOfUrgency: management.levelOfUrgency,
  //       isReferral: management.isReferral,
  //       isNeonat: management.isNeonat,
  //     })
  //   }
  // }, [isGetManagementSuccess])

  useEffect(() => {
    if (isCreateQSSuccess) {
      newToast({
        message: t('notifications.createSuccess', { ns: 'common' }),
        status: 'success',
      })

      close()
    }
  }, [isCreateQSSuccess])

  // useEffect(() => {
  //   if (isUpdateManagementSuccess) {
  //     newToast({
  //       message: t('notifications.updateSuccess', { ns: 'common' }),
  //       status: 'success',
  //     })

  //     close()
  //   }
  // }, [isUpdateManagementSuccess])

  const onSubmit: SubmitHandler<QuestionSequencesInputs> = data => {
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

    console.log({
      labelTranslations,
      descriptionTranslations,
      projectId,
      ...tmpData,
    })

    if (questionsSequenceId) {
      // updateManagement({
      //   id: managementId,
      //   labelTranslations,
      //   descriptionTranslations,
      //   filesToAdd,
      //   existingFilesToRemove,
      //   ...tmpData,
      // })
    } else {
      createQuestionsSequence({
        labelTranslations,
        descriptionTranslations,
        projectId,
        ...tmpData,
      })
    }
  }
  console.log(methods)
  if (isGetProjectSuccess) {
    return (
      <FormProvider<QuestionSequencesInputs>
        methods={methods}
        isError={isCreateQSError}
        error={createQSError}
      >
        <form onSubmit={methods.handleSubmit(onSubmit)}>
          <VStack align='left' spacing={8}>
            <Select label={t('type')} options={type} name='type' isRequired />
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

            {isCreateQSError && (
              <Box w='full'>
                <ErrorMessage error={createQSError} />
              </Box>
            )}
            {/* {isUpdateManagementError && (
              <Box w='full'>
                <ErrorMessage error={updateManagementError} />
              </Box>
            )} */}
            {/* {isGetManagementError && (
              <Box w='full'>
                <ErrorMessage error={getManagementError} />
              </Box>
            )} */}
            <HStack justifyContent='flex-end'>
              <Button
                type='submit'
                data-testid='submit'
                mt={6}
                isLoading={isCreateQSLoading}
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

export default QuestionSequencesForm
