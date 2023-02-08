/**
 * The external imports
 */
import { useEffect, useContext } from 'react'
import { FormProvider, useForm } from 'react-hook-form'
import { useTranslation } from 'next-i18next'
import { VStack, Button, HStack, Box, Text } from '@chakra-ui/react'
import { yupResolver } from '@hookform/resolvers/yup'
import * as yup from 'yup'

/**
 * The internal imports
 */
import { Slider, Input, Textarea } from '/components'
import { useGetProjectQuery } from '/lib/services/modules/project'
import { useCreateDiagnosisMutation } from '../../lib/services/modules/diagnosis'
import { useToast } from '/lib/hooks'
import { ModalContext } from '/lib/contexts'
import { HSTORE_LANGUAGES } from '/lib/config/constants'

const DiagnosisForm = ({
  projectId,
  decisionTreeId,
  diagnosisId = null,
  nextStep = null,
}) => {
  const { t } = useTranslation('diagnoses')
  const { newToast } = useToast()
  const { closeModal } = useContext(ModalContext)

  const { data: project } = useGetProjectQuery(projectId)

  const [
    createDiagnosis,
    {
      isSuccess: isCreateDiagnosisSuccess,
      isError: isCreateDiagnosisError,
      error: createDiagnosisError,
      isLoading: isCreateDiagnosisLoading,
    },
  ] = useCreateDiagnosisMutation()

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
        description: yup
          .string()
          .required(t('required', { ns: 'validations' })),
        levelOfUrgency: yup
          .number()
          .transform(value => (isNaN(value) ? undefined : value))
          .nullable(),
      })
    ),
    reValidateMode: 'onSubmit',
    defaultValues: {
      label: '',
      description: '',
      levelOfUrgency: 1,
    },
  })

  /**
   * Create or update a decision tree with data passed in params
   * @param {} data
   */
  const onSubmit = data => {
    const descriptionTranslations = {}
    HSTORE_LANGUAGES.forEach(language => {
      descriptionTranslations[language] =
        language === project.language.code ? data.description : ''
    })
    delete data.description

    const labelTranslations = {}
    HSTORE_LANGUAGES.forEach(language => {
      labelTranslations[language] =
        language === project.language.code ? data.label : ''
    })
    delete data.label

    if (diagnosisId) {
      // updateAlgorithm({
      //   id: decisionTreeId,
      //   descriptionTranslations,
      //   ...data,
      // })
    } else {
      createDiagnosis({
        decisionTreeId,
        labelTranslations,
        descriptionTranslations,
        ...data,
      })
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

  /**
   * If create successful, queue the toast and close the modal
   */
  useEffect(() => {
    if (isCreateDiagnosisSuccess) {
      newToast({
        message: t('notifications.createSuccess', { ns: 'common' }),
        status: 'success',
      })
      if (nextStep) {
        nextStep()
      } else {
        closeModal()
      }
    }
  }, [isCreateDiagnosisSuccess])

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
          <Textarea
            name='description'
            label={t('description')}
            helperText={t('helperText', {
              language: t(`languages.${project.language.code}`, {
                ns: 'common',
              }),
              ns: 'common',
            })}
          />
          <Slider name='levelOfUrgency' label={t('levelOfUrgency')} />

          {isCreateDiagnosisError && (
            <Box w='full'>
              <Text fontSize='m' color='red' data-cy='server_message'>
                {typeof createDiagnosisError.message === 'string'
                  ? createDiagnosisError.message.split(':')[0]
                  : createDiagnosisError.data.errors.join()}
              </Text>
            </Box>
          )}
          {/*{isUpdateAlgorithmError && (
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
              isLoading={
                isCreateDiagnosisLoading /*|| isUpdateAlgorithmLoading*/
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

export default DiagnosisForm
