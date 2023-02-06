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
import { useToast } from '/lib/hooks'
import { ModalContext } from '/lib/contexts'
import { HSTORE_LANGUAGES } from '/lib/config/constants'

const DecisionTreeForm = ({
  projectId,
  algorithmId,
  decisionTreeId = null,
}) => {
  const { t } = useTranslation('decisionTrees')
  const { newToast } = useToast()
  const { closeModal } = useContext(ModalContext)

  const { data: project } = useGetProjectQuery(projectId)
  const { data: complaintCategories } = useGetComplaintCategoriesQuery({
    projectId,
  })

  // const [
  //   createAlgorithm,
  //   {
  //     isSuccess: isCreateAlgorithmSuccess,
  //     isError: isCreateAlgorithmError,
  //     error: createAlgorithmError,
  //     isLoading: isCreateAlgorithmLoading,
  //   },
  // ] = useCreateAlgorithmMutation()

  // const {
  //   data: algorithm,
  //   isSuccess: isGetAlgorithmSuccess,
  //   isError: isGetAlgorithmError,
  //   error: getAlgorithmError,
  // } = useGetAlgorithmQuery(algorithmId, { skip: !decisionTreeId })

  // const [
  //   updateAlgorithm,
  //   {
  //     isSuccess: isUpdateAlgorithmSuccess,
  //     isError: isUpdateAlgorithmError,
  //     error: updateAlgorithmError,
  //     isLoading: isUpdateAlgorithmLoading,
  //   },
  // ] = useUpdateAlgorithmMutation()

  const methods = useForm({
    resolver: yupResolver(
      yup.object({
        label: yup.string().required(t('required', { ns: 'validations' })),
        nodeId: yup.string().required(t('required', { ns: 'validations' })),
      })
    ),
    reValidateMode: 'onSubmit',
    defaultValues: {
      label: '',
      nodeId: '',
      cutOffStart: '',
      cutOffEnd: '',
      cuttOffType: 'months',
    },
  })

  const cutOffTypesOptions = useConst(() => [
    { value: 'months', label: t('enum.cutOffTypes.months') },
    { value: 'days', label: t('enum.cutOffTypes.days') },
  ])

  const onSubmit = data => {
    const labelTranslations = {}
    HSTORE_LANGUAGES.forEach(language => {
      labelTranslations[language] =
        language === project.language.code ? data.label : ''
    })
    delete data.label

    if (decisionTreeId) {
      // updateAlgorithm({
      //   id: decisionTreeId,
      //   labelTranslations,
      //   ...data,
      // })
    } else {
      // createAlgorithm({
      //   algorithmId,
      //   labelTranslations,
      //   ...data,
      // })
    }
  }

  // /**
  //  * If the getAlgorithm query is successful, reset
  //  * the form with the existing algorithm values
  //  */
  // useEffect(() => {
  //   if (isGetAlgorithmSuccess) {
  //     methods.reset({
  //       name: algorithm.name,
  //       description: algorithm.descriptionTranslations[project.language.code],
  //       ageLimitMessage:
  //         algorithm.ageLimitMessageTranslations[project.language.code],
  //       mode: algorithm.mode,
  //       ageLimit: algorithm.ageLimit,
  //       minimumAge: algorithm.minimumAge,
  //       algorithmLanguages: algorithm.languages.map(language => language.id),
  //     })
  //   }
  // }, [isGetAlgorithmSuccess])

  // /**
  //  * If create successful, queue the toast and close the modal
  //  */
  // useEffect(() => {
  //   if (isCreateAlgorithmSuccess) {
  //     newToast({
  //       message: t('notifications.createSuccess', { ns: 'common' }),
  //       status: 'success',
  //     })
  //     closeModal()
  //   }
  // }, [isCreateAlgorithmSuccess])

  // /**
  //  * If update successful, queue the toast and close the modal
  //  */
  // useEffect(() => {
  //   if (isUpdateAlgorithmSuccess) {
  //     newToast({
  //       message: t('notifications.updateSuccess', { ns: 'common' }),
  //       status: 'success',
  //     })
  //     closeModal()
  //   }
  // }, [isUpdateAlgorithmSuccess])

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
            name='cutOffType'
            label={t('cutOffType')}
            options={cutOffTypesOptions}
          />
          <SimpleGrid columns={2} spacing={8}>
            <NumberInput name='cutOffStart' label={t('cutOffStart')} />
            <NumberInput name='cutOffEnd' label={t('cutOffEnd')} />
          </SimpleGrid>

          {/* {isCreateAlgorithmError && (
            <Box w='full'>
              <Text fontSize='m' color='red' data-cy='server_message'>
                {typeof createAlgorithmError.message === 'string'
                  ? createAlgorithmError.message.split(':')[0]
                  : createAlgorithmError.data.errors.join()}
              </Text>
            </Box>
          )}
          {isUpdateAlgorithmError && (
            <Box w='full'>
              <Text fontSize='m' color='red' data-cy='server_message'>
                {typeof updateAlgorithmError.message === 'string'
                  ? updateAlgorithmError.message.split(':')[0]
                  : updateAlgorithmError.data.errors.join()}
              </Text>
            </Box>
          )}
          {isGetAlgorithmError && (
            <Box w='full'>
              <Text fontSize='m' color='red' data-cy='server_message'>
                {typeof getAlgorithmError.message === 'string'
                  ? getAlgorithmError.message.split(':')[0]
                  : getAlgorithmError.data.errors.join()}
              </Text>
            </Box>
          )} */}
          <HStack justifyContent='flex-end'>
            <Button
              type='submit'
              data-cy='submit'
              mt={6}
              // isLoading={isCreateAlgorithmLoading || isUpdateAlgorithmLoading}
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
