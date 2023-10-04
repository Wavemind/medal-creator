/**
 * The external imports
 */
import { useEffect, useMemo } from 'react'
import { SubmitHandler, useForm } from 'react-hook-form'
import { useTranslation } from 'next-i18next'
import { VStack, Button, HStack, Spinner } from '@chakra-ui/react'
import { yupResolver } from '@hookform/resolvers/yup'
import { skipToken } from '@reduxjs/toolkit/dist/query'

/**
 * The internal imports
 */
import Select from '@/components/inputs/select'
import Input from '@/components/inputs/input'
import FormProvider from '@/components/formProvider'
import { useGetComplaintCategoriesQuery } from '@/lib/api/modules/enhanced/node.enhanced'
import { useGetProjectQuery } from '@/lib/api/modules/enhanced/project.enhanced'
import {
  useCreateDecisionTreeMutation,
  useGetDecisionTreeQuery,
  useUpdateDecisionTreeMutation,
} from '@/lib/api/modules/enhanced/decisionTree.enhanced'
import { useModal } from '@/lib/hooks'
import { extractTranslation } from '@/lib/utils/string'
import { transformPaginationToOptions } from '@/lib/utils/transformOptions'
import DecisionTreeService from '@/lib/services/decisionTree.service'
import CutOff from '@/components/inputs/cutOff'
import type { DecisionTreeInputs, DecisionTreeFormComponent } from '@/types'

const DecisionTreeForm: DecisionTreeFormComponent = ({
  projectId,
  algorithmId,
  decisionTreeId = null,
  nextStep = null,
  setDecisionTreeId = null,
}) => {
  const { t } = useTranslation('decisionTrees')
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
    resolver: yupResolver(DecisionTreeService.getValidationSchema(t)),
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
    const transformedData = DecisionTreeService.transformData(
      data,
      project?.language.code
    )

    if (decisionTreeId) {
      updateDecisionTree({
        ...transformedData,
        id: decisionTreeId,
      })
    } else {
      createDecisionTree({
        ...transformedData,
        algorithmId,
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
        isError={
          isCreateDecisionTreeError ||
          isUpdateDecisionTreeError ||
          isGetDecisionTreeError
        }
        error={{
          ...createDecisionTreeError,
          ...updateDecisionTreeError,
          ...getDecisionTreeError,
        }}
        isSuccess={isCreateDecisionTreeSuccess || isUpdateDecisionTreeSuccess}
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
