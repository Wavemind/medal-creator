/**
 * The external imports
 */
import { useEffect, useContext } from 'react'
import { FormProvider, useForm } from 'react-hook-form'
import { useTranslation } from 'next-i18next'
import {
  VStack,
  Button,
  HStack,
  SimpleGrid,
  Box,
  Text,
  useConst,
} from '@chakra-ui/react'
import { yupResolver } from '@hookform/resolvers/yup'
import * as yup from 'yup'

/**
 * The internal imports
 */
import { Select, Input, NumberInput } from '/components'
import { useGetComplaintCategoriesQuery } from '/lib/services/modules/node'
import { useGetProjectQuery } from '/lib/services/modules/project'
import {
  useCreateDecisionTreeMutation,
  useGetDecisionTreeQuery,
  useUpdateDecisionTreeMutation,
} from '/lib/services/modules/decisionTree'
import { useToast } from '/lib/hooks'
import { ModalContext } from '/lib/contexts'
import { HSTORE_LANGUAGES } from '/lib/config/constants'

const DecisionTreeForm = ({
  projectId,
  algorithmId,
  decisionTreeId = null,
  nextStep = null,
  setDecisionTreeId = null,
}) => {
  const { t } = useTranslation('decisionTrees')
  const { newToast } = useToast()
  const { closeModal } = useContext(ModalContext)

  const { data: project } = useGetProjectQuery(projectId)
  const { data: complaintCategories } = useGetComplaintCategoriesQuery({
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
  } = useGetDecisionTreeQuery(decisionTreeId, { skip: !decisionTreeId })

  const [
    updateDecisionTree,
    {
      isSuccess: isUpdateDecisionTreeSuccess,
      isError: isUpdateDecisionTreeError,
      error: updateDecisionTreeError,
      isLoading: isUpdateDecisionTreeLoading,
    },
  ] = useUpdateDecisionTreeMutation()

  const methods = useForm({
    resolver: yupResolver(
      yup.object({
        label: yup.string().required(t('required', { ns: 'validations' })),
        nodeId: yup.string().required(t('required', { ns: 'validations' })),
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
      nodeId: '',
      cutOffStart: '',
      cutOffEnd: '',
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
  const onSubmit = data => {
    const labelTranslations = {}
    HSTORE_LANGUAGES.forEach(language => {
      labelTranslations[language] =
        language === project.language.code ? data.label : ''
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
        id: decisionTreeId,
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
      if (nextStep) {
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
            options={complaintCategories}
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
              <Text fontSize='m' color='red' data-cy='server_message'>
                {typeof createDecisionTreeError.message === 'string'
                  ? createDecisionTreeError.message.split(':')[0]
                  : createDecisionTreeError.data.errors.join()}
              </Text>
            </Box>
          )}
          {isUpdateDecisionTreeError && (
            <Box w='full'>
              <Text fontSize='m' color='red' data-cy='server_message'>
                {typeof updateDecisionTreeError.message === 'string'
                  ? updateDecisionTreeError.message.split(':')[0]
                  : updateDecisionTreeError.data.errors.join()}
              </Text>
            </Box>
          )}
          {isGetDecisionTreeError && (
            <Box w='full'>
              <Text fontSize='m' color='red' data-cy='server_message'>
                {typeof getDecisionTreeError.message === 'string'
                  ? getDecisionTreeError.message.split(':')[0]
                  : getDecisionTreeError.data.errors.join()}
              </Text>
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
