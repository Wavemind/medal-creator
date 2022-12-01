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
  useLazyGetAlgorithmQuery,
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
    },
  ] = useCreateAlgorithmMutation()
  const [
    getAlgorithm,
    {
      data,
      isSuccess: isGetAlgorithmSuccess,
      isError: isGetAlgorithmError,
      error: getAlgorithmError,
    },
  ] = useLazyGetAlgorithmQuery()

  useEffect(() => {
    if (algorithmId) {
      getAlgorithm(algorithmId)
    }
  }, [])

  useEffect(() => {
    if (isGetAlgorithmSuccess) {
      console.log(data)
      methods.reset({
        name: data.name,
        description: data.descriptionTranslations[project.language.code],
        ageLimitMessage:
          data.ageLimitMessageTranslations[project.language.code],
        mode: data.mode,
        ageLimit: data.ageLimit,
        minimumAge: data.minimumAge,
        algorithmLanguages: data.languages.map(language => language.id),
      })
    }
  }, [isGetAlgorithmSuccess])

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
    { value: 'intervention', label: t('modes.intervention') },
    { value: 'arm_control', label: t('modes.armControl') },
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

    const algorithmLanguagesAttributes = data.algorithmLanguages.map(
      language => ({
        languageId: language,
      })
    )

    delete data.description
    delete data.ageLimitMessage
    delete data.algorithmLanguages

    createAlgorithm({
      projectId,
      descriptionTranslations,
      ageLimitMessageTranslations,
      algorithmLanguagesAttributes,
      ...data,
    })
  }

  /**
   * If successful, queue the toast and close the modal
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

  return (
    <FormProvider {...methods}>
      <form onSubmit={methods.handleSubmit(onSubmit)}>
        <VStack align='left' spacing={8}>
          <Input name='name' label={t('name')} isRequired />
          <NumberInput name='ageLimit' label={t('ageLimit')} min={1} />
          <Textarea
            name='ageLimitMessage'
            label={t('ageLimitMessage')}
            isRequired
          />
          <NumberInput name='minimumAge' label={t('minimumAge')} />
          <Select
            name='mode'
            label={t('mode')}
            options={modeOptions}
            isRequired
          />
          <Textarea name='description' label={t('description')} isRequired />
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
              isLoading={methods.formState.isSubmitting}
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
