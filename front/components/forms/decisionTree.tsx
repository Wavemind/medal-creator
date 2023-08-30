/**
 * The external imports
 */
import { useEffect, useMemo } from 'react'
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
import Select from '@/components/inputs/select'
import Input from '@/components/inputs/input'
import FormProvider from '@/components/formProvider'
import Number from '@/components/inputs/number'
import ErrorMessage from '@/components/errorMessage'
import { useGetComplaintCategoriesQuery } from '@/lib/api/modules/enhanced/node.enhanced'
import { useGetProjectQuery } from '@/lib/api/modules/enhanced/project.enhanced'
import {
  useCreateDecisionTreeMutation,
  useGetDecisionTreeQuery,
  useUpdateDecisionTreeMutation,
} from '@/lib/api/modules/enhanced/decisionTree.enhanced'
import { useToast, useModal } from '@/lib/hooks'
import { HSTORE_LANGUAGES } from '@/lib/config/constants'
import { extractTranslation } from '@/lib/utils/string'
import { transformPaginationToOptions } from '@/lib/utils/transformOptions'
import CutOff from '@/components/inputs/cutOff'
import type {
  DecisionTreeInputs,
  DecisionTreeFormComponent,
  Languages,
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
  const { close } = useModal()

  const { data: project, isSuccess: isProjectSuccess } = useGetProjectQuery({
    id: projectId,
  })
  const { data: complaintCategories, isSuccess: isComplaintCategoriesSuccess } =
    useGetComplaintCategoriesQuery({ projectId })

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
  } = useGetDecisionTreeQuery(
    decisionTreeId ? { id: decisionTreeId } : skipToken
  )

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

  /**
   * Create or update a decision tree with data passed in params
   * @param {} data
   */
  const onSubmit: SubmitHandler<DecisionTreeInputs> = data => {
    const tmpData = { ...data }
    const labelTranslations: Languages = {}
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
        label: extractTranslation(
          decisionTree.labelTranslations,
          project.language.code
        ),
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
        close()
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
      close()
    }
  }, [isUpdateDecisionTreeSuccess])

  const complaintCategoriesOptions = useMemo(() => {
    if (isComplaintCategoriesSuccess && isProjectSuccess) {
      return transformPaginationToOptions(
        complaintCategories.edges,
        project.language.code
      )
    }
    return []
  }, [isComplaintCategoriesSuccess, isProjectSuccess])

  if (isProjectSuccess) {
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
                  defaultValue: '',
                }),
                ns: 'common',
              })}
            />
            <Select
              name='nodeId'
              label={t('complaintCategory')}
              options={complaintCategoriesOptions}
              isRequired
            />
            <CutOff />
            {/* <Select
              name='cutOffValueType'
              label={t('cutOffValueType')}
              options={cutOffValueTypesOptions}
            />
            <SimpleGrid columns={2} spacing={8}>
              <Number name='cutOffStart' label={t('cutOffStart')} />
              <Number name='cutOffEnd' label={t('cutOffEnd')} />
            </SimpleGrid> */}
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
                data-testid='submit'
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
