/**
 * The external imports
 */
import { useEffect, useContext } from 'react'
import { SubmitHandler, useForm } from 'react-hook-form'
import { useTranslation } from 'next-i18next'
import {
  VStack,
  Button,
  HStack,
  SimpleGrid,
  Box,
  useConst,
  Spinner,
} from '@chakra-ui/react'
import { yupResolver } from '@hookform/resolvers/yup'
import * as yup from 'yup'
import { skipToken } from '@reduxjs/toolkit/dist/query'

/**
 * The internal imports
 */
import {
  Select,
  Input,
  FormProvider,
  NumberInput,
  ErrorMessage,
} from '@/components'
import {
  useGetComplaintCategoriesQuery,
  useGetProjectQuery,
  useCreateDecisionTreeMutation,
  useGetDecisionTreeQuery,
  useUpdateDecisionTreeMutation,
} from '@/lib/api/modules'
import { useToast } from '@/lib/hooks'
import { ModalContext } from '@/lib/contexts'
import { HSTORE_LANGUAGES } from '@/lib/config/constants'
import type {
  StringIndexType,
  DecisionTreeInputs,
  DecisionTreeFormComponent,
} from '@/types'

const DecisionTreeForm: DecisionTreeFormComponent = ({
  projectId,
  algorithmId,
  decisionTreeId = null,
  nextStep = null,
  setDecisionTreeId = null,
}) => {
  const { t } = useTranslation('decisionTrees')
  const { newToast } = useToast()
  const { closeModal } = useContext(ModalContext)

  const { data: project, isSuccess: isProjectFetched } =
    useGetProjectQuery(projectId)
  const { data: complaintCategories, isSuccess: isSuccesComplaintCategories } =
    useGetComplaintCategoriesQuery({
      projectId,
    })

  const [
    createDecisionTree,
    {
      data: newDecisionTree,
      isSuccess: isCreateDecisionTreeSuccess,
      isError: isCreateDecisionTreeError,
      error: createDecisionTreeError,
      isLoading: isCreateDecisionTreeLoading,
    },
  ] = useCreateDecisionTreeMutation()

  const {
    data: decisionTree,
    isSuccess: isGetDecisionTreeSuccess,
    isError: isGetDecisionTreeError,
    error: getDecisionTreeError,
  } = useGetDecisionTreeQuery(decisionTreeId ?? skipToken)

  const [
    updateDecisionTree,
    {
      isSuccess: isUpdateDecisionTreeSuccess,
      isError: isUpdateDecisionTreeError,
      error: updateDecisionTreeError,
      isLoading: isUpdateDecisionTreeLoading,
    },
  ] = useUpdateDecisionTreeMutation()

  const methods = useForm<DecisionTreeInputs>({
    resolver: yupResolver(
      yup.object({
        label: yup.string().label(t('label')).required(),
        nodeId: yup.string().label(t('complaintCategory')).required(),
        cutOffStart: yup
          .number()
          .transform(value => (isNaN(value) ? undefined : value))
          .nullable(),
        cutOffEnd: yup
          .number()
          .transform(value => (isNaN(value) ? undefined : value))
          .nullable(),
      })
    ),
    reValidateMode: 'onSubmit',
    defaultValues: {
      label: '',
      nodeId: undefined,
      cutOffStart: null,
      cutOffEnd: null,
      cutOffValueType: 'days',
    },
  })

  const cutOffValueTypesOptions = useConst(() => [
    { value: 'months', label: t('enum.cutOffValueTypes.months') },
    { value: 'days', label: t('enum.cutOffValueTypes.days') },
  ])

  /**
   * Create or update a decision tree with data passed in params
   * @param {} data
   */
  const onSubmit: SubmitHandler<DecisionTreeInputs> = data => {
    const tmpData = { ...data }
    const labelTranslations: StringIndexType = {}
    HSTORE_LANGUAGES.forEach(language => {
      labelTranslations[language] =
        language === project?.language.code && tmpData.label
          ? tmpData.label
          : ''
    })
    delete tmpData.label

    if (!tmpData.cutOffStart) {
      delete tmpData.cutOffStart
    }

    if (!tmpData.cutOffEnd) {
      delete tmpData.cutOffEnd
    }

    if (decisionTreeId) {
      updateDecisionTree({
        id: decisionTreeId,
        labelTranslations,
        ...tmpData,
      })
    } else {
      createDecisionTree({
        algorithmId,
        labelTranslations,
        ...tmpData,
      })
    }
  }

  /**
   * If the getDecisionTree query is successful, reset
   * the form with the existing algorithm values
   */
  useEffect(() => {
    if (isGetDecisionTreeSuccess && project) {
      methods.reset({
        label: decisionTree.labelTranslations[project.language.code],
        nodeId: decisionTree.node.id,
        cutOffStart: decisionTree.cutOffStart,
        cutOffEnd: decisionTree.cutOffEnd,
        cutOffValueType: 'days',
      })
    }
  }, [isGetDecisionTreeSuccess])

  /**
   * If create successful, queue the toast and close the modal
   */
  useEffect(() => {
    if (isCreateDecisionTreeSuccess) {
      newToast({
        message: t('notifications.createSuccess', { ns: 'common' }),
        status: 'success',
      })
      if (nextStep && setDecisionTreeId && newDecisionTree) {
        setDecisionTreeId(newDecisionTree.id)
        nextStep()
      } else {
        closeModal()
      }
    }
  }, [isCreateDecisionTreeSuccess])

  /**
   * If update successful, queue the toast and close the modal
   */
  useEffect(() => {
    if (isUpdateDecisionTreeSuccess) {
      newToast({
        message: t('notifications.updateSuccess', { ns: 'common' }),
        status: 'success',
      })
      closeModal()
    }
  }, [isUpdateDecisionTreeSuccess])

  if (isProjectFetched) {
    return (
      <FormProvider<DecisionTreeInputs>
        methods={methods}
        isError={isCreateDecisionTreeError || isUpdateDecisionTreeError}
        error={{ ...createDecisionTreeError, ...updateDecisionTreeError }}
      >
        <form onSubmit={methods.handleSubmit(onSubmit)}>
          <VStack align='left' spacing={8}>
            <Input
              name='label'
              label={t('label')}
              isRequired
              helperText={t('helperText', {
                language: t(`languages.${project.language.code}`, {
                  ns: 'common',
                  defaultValue: 'en',
                }),
                ns: 'common',
              })}
            />
            <Select
              name='nodeId'
              label={t('complaintCategory')}
              options={isSuccesComplaintCategories ? complaintCategories : []}
              valueOption='id'
              labelOption={project.language.code}
              isRequired
            />
            <Select
              name='cutOffValueType'
              label={t('cutOffValueType')}
              options={cutOffValueTypesOptions}
            />
            <SimpleGrid columns={2} spacing={8}>
              <NumberInput name='cutOffStart' label={t('cutOffStart')} />
              <NumberInput name='cutOffEnd' label={t('cutOffEnd')} />
            </SimpleGrid>
            {isCreateDecisionTreeError && (
              <Box w='full'>
                <ErrorMessage error={createDecisionTreeError} />
              </Box>
            )}
            {isUpdateDecisionTreeError && (
              <Box w='full'>
                <ErrorMessage error={updateDecisionTreeError} />
              </Box>
            )}
            {isGetDecisionTreeError && (
              <Box w='full'>
                <ErrorMessage error={getDecisionTreeError} />
              </Box>
            )}
            <HStack justifyContent='flex-end'>
              <Button
                type='submit'
                data-cy='submit'
                mt={6}
                isLoading={
                  isCreateDecisionTreeLoading || isUpdateDecisionTreeLoading
                }
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

export default DecisionTreeForm
