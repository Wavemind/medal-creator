/**
 * The external imports
 */
import { FC, useEffect, useContext } from 'react'
import { SubmitHandler, FormProvider, useForm } from 'react-hook-form'
import { useTranslation } from 'next-i18next'
import {
  VStack,
  Button,
  HStack,
  SimpleGrid,
  Box,
  useConst,
} from '@chakra-ui/react'
import { yupResolver } from '@hookform/resolvers/yup'
import * as yup from 'yup'

/**
 * The internal imports
 */
import { Select, Input, NumberInput, FormError } from '@/components'
import { useGetComplaintCategoriesQuery } from '@/lib/services/modules/node'
import { useGetProjectQuery } from '@/lib/services/modules/project'
import {
  useCreateDecisionTreeMutation,
  useGetDecisionTreeQuery,
  useUpdateDecisionTreeMutation,
} from '@/lib/services/modules/decisionTree'
import { useToast } from '@/lib/hooks'
import { ModalContext } from '@/lib/contexts'
import { HSTORE_LANGUAGES } from '@/lib/config/constants'
import { skipToken } from '@reduxjs/toolkit/dist/query'
import type { Project } from '@/types/project'
import type { StringIndexType } from '@/types/common'
import type { DecisionTreeInputs } from '@/types/decisionTree'

/**
 * Type definitions
 */
type DecisionTreeFormProps = {
  projectId: number
  algorithmId: number
  decisionTreeId?: number
  nextStep?: () => void
  setDecisionTreeId?: React.Dispatch<React.SetStateAction<number | undefined>>
}

const DecisionTreeForm: FC<DecisionTreeFormProps> = ({
  projectId,
  algorithmId,
  decisionTreeId = null,
  nextStep = null,
  setDecisionTreeId = null,
}) => {
  const { t } = useTranslation('decisionTrees')
  const { newToast } = useToast()
  const { closeModal } = useContext(ModalContext)

  const { data: project = {} as Project } = useGetProjectQuery(projectId)
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
    const labelTranslations: StringIndexType = {}
    HSTORE_LANGUAGES.forEach(language => {
      labelTranslations[language] =
        language === project.language.code && data.label ? data.label : ''
    })
    delete data.label

    if (!data.cutOffStart) {
      delete data.cutOffStart
    }

    if (!data.cutOffEnd) {
      delete data.cutOffEnd
    }

    if (decisionTreeId) {
      updateDecisionTree({
        // id: decisionTreeId, // Seems not needed. need to check. Same in algorithm form
        labelTranslations,
        ...data,
      })
    } else {
      createDecisionTree({
        algorithmId,
        labelTranslations,
        ...data,
      })
    }
  }

  /**
   * If the getDecisionTree query is successful, reset
   * the form with the existing algorithm values
   */
  useEffect(() => {
    if (isGetDecisionTreeSuccess) {
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

  return (
    <FormProvider {...methods}>
      <form onSubmit={methods.handleSubmit(onSubmit)}>
        <VStack align='left' spacing={8}>
          <Input
            name='label'
            label={t('label')}
            isRequired
            helperText={t('helperText', {
              language: t(`languages.${project.language.code}`, {
                ns: 'common',
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
              <FormError error={createDecisionTreeError} />
            </Box>
          )}
          {isUpdateDecisionTreeError && (
            <Box w='full'>
              <FormError error={updateDecisionTreeError} />
            </Box>
          )}
          {isGetDecisionTreeError && (
            <Box w='full'>
              <FormError error={getDecisionTreeError} />
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

export default DecisionTreeForm
