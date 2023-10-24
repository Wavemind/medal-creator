/**
 * The external imports
 */
import { useEffect, useMemo } from 'react'
import { SubmitHandler, useForm } from 'react-hook-form'
import { useTranslation } from 'next-i18next'
import { VStack, Button, HStack } from '@chakra-ui/react'
import { yupResolver } from '@hookform/resolvers/yup'
import { skipToken } from '@reduxjs/toolkit/dist/query'

/**
 * The internal imports
 */
import Select from '@/components/inputs/select'
import Input from '@/components/inputs/input'
import FormProvider from '@/components/formProvider'
import { useGetComplaintCategoriesQuery } from '@/lib/api/modules/enhanced/node.enhanced'
import {
  useCreateDecisionTreeMutation,
  useGetDecisionTreeQuery,
  useUpdateDecisionTreeMutation,
} from '@/lib/api/modules/enhanced/decisionTree.enhanced'
import { useAppRouter, useModal, useProject } from '@/lib/hooks'
import { transformPaginationToOptions } from '@/lib/utils/transformOptions'
import DecisionTreeService from '@/lib/services/decisionTree.service'
import CutOff from '@/components/inputs/cutOff'
import type { DecisionTreeInputs, DecisionTreeFormComponent } from '@/types'

const DecisionTreeForm: DecisionTreeFormComponent = ({
  algorithmId,
  decisionTreeId = null,
  nextStep = null,
  setDecisionTreeId = null,
}) => {
  const { t } = useTranslation('decisionTrees')
  const { close } = useModal()
  const { projectLanguage } = useProject()
  const {
    query: { projectId },
  } = useAppRouter()

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
      projectLanguage
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
    if (isGetDecisionTreeSuccess) {
      methods.reset(
        DecisionTreeService.buildFormData(decisionTree, projectLanguage)
      )
    }
  }, [isGetDecisionTreeSuccess, decisionTree])

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
    if (isComplaintCategoriesSuccess) {
      return transformPaginationToOptions(
        complaintCategories.edges,
        projectLanguage
      )
    }
    return []
  }, [isComplaintCategoriesSuccess])

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
              language: t(`languages.${projectLanguage}`, {
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

export default DecisionTreeForm
