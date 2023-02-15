/**
 * The external imports
 */
import { useEffect, useContext, useMemo } from 'react'
import { FormProvider, useForm } from 'react-hook-form'
import { useTranslation } from 'next-i18next'
import { VStack, Button, HStack, Box, Text, useConst } from '@chakra-ui/react'
import { yupResolver } from '@hookform/resolvers/yup'
import * as yup from 'yup'

/**
 * The internal imports
 */
import {
  Select,
  Input,
  Textarea,
  NumberInput,
  CheckboxGroup,
} from '/components'
import {
  useCreateAlgorithmMutation,
  useGetAlgorithmQuery,
  useUpdateAlgorithmMutation,
} from '/lib/services/modules/algorithm'
import { useGetLanguagesQuery } from '/lib/services/modules/language'
import { useGetProjectQuery } from '/lib/services/modules/project'
import { useToast } from '/lib/hooks'
import { ModalContext } from '/lib/contexts'
import { HSTORE_LANGUAGES } from '/lib/config/constants'

const AlgorithmForm = ({ projectId, algorithmId = null }) => {
  const { t } = useTranslation('algorithms')
  const { newToast } = useToast()
  const { closeModal } = useContext(ModalContext)

  const { data: project } = useGetProjectQuery(projectId)
  const { data: languages } = useGetLanguagesQuery()
  const [
    createAlgorithm,
    {
      isSuccess: isCreateAlgorithmSuccess,
      isError: isCreateAlgorithmError,
      error: createAlgorithmError,
      isLoading: isCreateAlgorithmLoading,
    },
  ] = useCreateAlgorithmMutation()

  const {
    data: algorithm,
    isSuccess: isGetAlgorithmSuccess,
    isError: isGetAlgorithmError,
    error: getAlgorithmError,
  } = useGetAlgorithmQuery(algorithmId, { skip: !algorithmId })

  const [
    updateAlgorithm,
    {
      isSuccess: isUpdateAlgorithmSuccess,
      isError: isUpdateAlgorithmError,
      error: updateAlgorithmError,
      isLoading: isUpdateAlgorithmLoading,
    },
  ] = useUpdateAlgorithmMutation()

  /**
   * Filter languages to select English by default
   */
  const englishLanguageId = useMemo(() => {
    if (languages) {
      return languages
        .filter(language => language.code === 'en')
        .map(language => language.id)
    }
    return []
  }, [languages])

  const methods = useForm({
    resolver: yupResolver(
      yup.object({
        name: yup.string().required(t('required', { ns: 'validations' })),
        description: yup
          .string()
          .required(t('required', { ns: 'validations' })),
        ageLimitMessage: yup
          .string()
          .required(t('required', { ns: 'validations' })),
        mode: yup.string().required(t('required', { ns: 'validations' })),
        ageLimit: yup.number().required(t('required', { ns: 'validations' })),
        minimumAge: yup.number().required(t('required', { ns: 'validations' })),
      })
    ),
    reValidateMode: 'onSubmit',
    defaultValues: {
      name: '',
      description: '',
      ageLimitMessage: '',
      mode: '',
      ageLimit: 1,
      minimumAge: 0,
      algorithmLanguages: englishLanguageId,
    },
  })

  const modeOptions = useConst(() => [
    { value: 'intervention', label: t('enum.mode.intervention') },
    { value: 'arm_control', label: t('enum.mode.arm_control') },
  ])

  const onSubmit = data => {
    const descriptionTranslations = {}
    const ageLimitMessageTranslations = {}
    HSTORE_LANGUAGES.forEach(language => {
      descriptionTranslations[language] =
        language === project.language.code ? data.description : ''
      ageLimitMessageTranslations[language] =
        language === project.language.code ? data.ageLimitMessage : ''
    })

    delete data.description
    delete data.ageLimitMessage

    if (algorithmId) {
      updateAlgorithm({
        id: algorithmId,
        descriptionTranslations,
        ageLimitMessageTranslations,
        languageIds: data.algorithmLanguages,
        ...data,
      })
    } else {
      createAlgorithm({
        projectId,
        descriptionTranslations,
        ageLimitMessageTranslations,
        languageIds: data.algorithmLanguages,
        ...data,
      })
    }
  }

  /**
   * If the getAlgorithm query is successful, reset
   * the form with the existing algorithm values
   */
  useEffect(() => {
    if (isGetAlgorithmSuccess) {
      methods.reset({
        name: algorithm.name,
        description: algorithm.descriptionTranslations[project.language.code],
        ageLimitMessage:
          algorithm.ageLimitMessageTranslations[project.language.code],
        mode: algorithm.mode,
        ageLimit: algorithm.ageLimit,
        minimumAge: algorithm.minimumAge,
        algorithmLanguages: algorithm.languages.map(language => language.id),
      })
    }
  }, [isGetAlgorithmSuccess])

  /**
   * If create successful, queue the toast and close the modal
   */
  useEffect(() => {
    if (isCreateAlgorithmSuccess) {
      newToast({
        message: t('notifications.createSuccess', { ns: 'common' }),
        status: 'success',
      })
      closeModal()
    }
  }, [isCreateAlgorithmSuccess])

  /**
   * If update successful, queue the toast and close the modal
   */
  useEffect(() => {
    if (isUpdateAlgorithmSuccess) {
      newToast({
        message: t('notifications.updateSuccess', { ns: 'common' }),
        status: 'success',
      })
      closeModal()
    }
  }, [isUpdateAlgorithmSuccess])

  return (
    <FormProvider {...methods}>
      <form onSubmit={methods.handleSubmit(onSubmit)}>
        <VStack align='left' spacing={8}>
          <Input name='name' label={t('name')} isRequired />
          <NumberInput
            name='ageLimit'
            label={t('ageLimit')}
            min={1}
            isRequired
          />
          <Textarea
            name='ageLimitMessage'
            label={t('ageLimitMessage')}
            helperText={t('helperText', {
              language: t(`languages.${project.language.code}`, {
                ns: 'common',
              }),
              ns: 'common',
            })}
            isRequired
          />
          <NumberInput name='minimumAge' label={t('minimumAge')} isRequired />
          <Select
            name='mode'
            label={t('mode')}
            options={modeOptions}
            isRequired
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
            isRequired
          />
          <CheckboxGroup
            name='algorithmLanguages'
            label={t('algorithmLanguages')}
            options={languages}
            disabledOptions={englishLanguageId}
          />
          {isCreateAlgorithmError && (
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
          )}
          <HStack justifyContent='flex-end'>
            <Button
              type='submit'
              data-cy='submit'
              mt={6}
              isLoading={isCreateAlgorithmLoading || isUpdateAlgorithmLoading}
            >
              {t('save', { ns: 'common' })}
            </Button>
          </HStack>
        </VStack>
      </form>
    </FormProvider>
  )
}

export default AlgorithmForm
