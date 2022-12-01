/**
 * The external imports
 */
import { useEffect, useContext, useMemo } from 'react'
import { FormProvider, useForm } from 'react-hook-form'
import { useTranslation } from 'next-i18next'
import { useRouter } from 'next/router'
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
import { useCreateAlgorithmMutation } from '/lib/services/modules/algorithm'
import { useGetLanguagesQuery } from '/lib/services/modules/language'
import { useGetProjectQuery } from '/lib/services/modules/project'
import { useToast } from '/lib/hooks'
import { ModalContext } from '/lib/contexts'
import { HSTORE_LANGUAGES } from '/lib/config/constants'

const CreateAlgorithmForm = () => {
  const { t } = useTranslation('algorithms')
  const { newToast } = useToast()
  const { closeModal } = useContext(ModalContext)
  const router = useRouter()
  const { projectId } = router.query

  const { data: project } = useGetProjectQuery(projectId)
  const { data: languages } = useGetLanguagesQuery()

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
        mode: yup.number().required(t('required', { ns: 'validations' })),
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

  const [createAlgorithm, { isSuccess, isError, error }] =
    useCreateAlgorithmMutation()

  const modeOptions = useConst(() => [
    { value: 0, label: t('modes.intervention') },
    { value: 1, label: t('modes.armControl') },
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
    if (isSuccess) {
      newToast({
        message: t('notifications.createSuccess', { ns: 'common' }),
        status: 'success',
      })
      closeModal()
    }
  }, [isSuccess])

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
          {isError && (
            <Box w='full'>
              <Text fontSize='m' color='red' data-cy='server_message'>
                {typeof error.message === 'string'
                  ? error.message.split(':')[0]
                  : error.data.errors.join()}
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

export default CreateAlgorithmForm
