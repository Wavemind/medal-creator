/**
 * The external imports
 */
import { useEffect, useMemo } from 'react'
import { SubmitHandler, useForm } from 'react-hook-form'
import { useTranslation } from 'next-i18next'
import { VStack, Button, HStack, useConst, Spinner } from '@chakra-ui/react'
import { yupResolver } from '@hookform/resolvers/yup'
import { skipToken } from '@reduxjs/toolkit/dist/query'

/**
 * The internal imports
 */
import Select from '@/components/inputs/select'
import Input from '@/components/inputs/input'
import Textarea from '@/components/inputs/textarea'
import Number from '@/components/inputs/number'
import CheckboxGroup from '@/components/inputs/checkboxGroup'
import FormProvider from '@/components/formProvider'
import {
  useCreateAlgorithmMutation,
  useGetAlgorithmQuery,
  useUpdateAlgorithmMutation,
} from '@/lib/api/modules/enhanced/algorithm.enhanced'
import { useGetLanguagesQuery } from '@/lib/api/modules/enhanced/language.enhanced'
import { useGetProjectQuery } from '@/lib/api/modules/enhanced/project.enhanced'
import { useModal } from '@/lib/hooks'
import { extractTranslation } from '@/lib/utils/string'
import AlgorithmService from '@/lib/services/algorithm.service'
import type { AlgorithmInputs, AlgorithmFormComponent } from '@/types'

const AlgorithmForm: AlgorithmFormComponent = ({
  projectId,
  algorithmId = null,
}) => {
  const { t } = useTranslation('algorithms')
  const { close } = useModal()

  const { data: project, isSuccess: isProjectSuccess } = useGetProjectQuery({
    id: projectId,
  })
  const { data: languages, isSuccess: isLanguagesSuccess } =
    useGetLanguagesQuery()
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
  } = useGetAlgorithmQuery(algorithmId ? { id: algorithmId } : skipToken)

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

  const methods = useForm<AlgorithmInputs>({
    resolver: yupResolver(AlgorithmService.getValidationSchema(t)),
    reValidateMode: 'onSubmit',
    defaultValues: {
      name: '',
      description: '',
      ageLimitMessage: '',
      mode: '',
      ageLimit: null,
      minimumAge: null,
      languageIds: englishLanguageId,
    },
  })

  const modeOptions = useConst(() => [
    { value: 'intervention', label: t('enum.mode.intervention') },
    { value: 'arm_control', label: t('enum.mode.arm_control') },
  ])

  const onSubmit: SubmitHandler<AlgorithmInputs> = data => {
    if (project) {
      const transformedData = AlgorithmService.transformData(
        data,
        project.language.code
      )

      if (algorithmId) {
        updateAlgorithm({
          ...transformedData,
          id: algorithmId,
        })
      } else {
        createAlgorithm({
          ...transformedData,
          projectId,
        })
      }
    }
  }

  /**
   * If the getAlgorithm query is successful, reset
   * the form with the existing algorithm values
   */
  useEffect(() => {
    if (algorithm && project) {
      methods.reset({
        name: algorithm.name,
        description: extractTranslation(
          algorithm.descriptionTranslations,
          project.language.code
        ),
        ageLimitMessage: extractTranslation(
          algorithm.ageLimitMessageTranslations,
          project.language.code
        ),
        mode: algorithm.mode,
        ageLimit: algorithm.ageLimit,
        minimumAge: algorithm.minimumAge,
        languageIds: algorithm.languages.map(language => language.id),
      })
    }
  }, [isGetAlgorithmSuccess])

  if (isProjectSuccess && isLanguagesSuccess) {
    return (
      <FormProvider<AlgorithmInputs>
        methods={methods}
        isError={
          isCreateAlgorithmError ||
          isUpdateAlgorithmError ||
          isGetAlgorithmError
        }
        error={{
          ...createAlgorithmError,
          ...updateAlgorithmError,
          ...getAlgorithmError,
        }}
        isSuccess={isCreateAlgorithmSuccess || isUpdateAlgorithmSuccess}
        callbackAfterSuccess={close}
      >
        <form onSubmit={methods.handleSubmit(onSubmit)}>
          <VStack align='left' spacing={8}>
            <Input name='name' label={t('name')} isRequired />
            <Number name='ageLimit' label={t('ageLimit')} min={1} isRequired />
            <Textarea
              name='ageLimitMessage'
              label={t('ageLimitMessage')}
              helperText={t('helperText', {
                language: t(`languages.${project.language.code}`, {
                  ns: 'common',
                  defaultValue: '',
                }),
                ns: 'common',
              })}
              isRequired
            />
            <Number name='minimumAge' label={t('minimumAge')} isRequired />
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
                  defaultValue: '',
                }),
                ns: 'common',
              })}
              isRequired
            />
            {languages && (
              <CheckboxGroup
                name='languageIds'
                label={t('algorithmLanguages')}
                options={languages}
                disabledOptions={englishLanguageId}
              />
            )}
            <HStack justifyContent='flex-end'>
              <Button
                type='submit'
                data-testid='submit'
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

  return <Spinner size='xl' />
}

export default AlgorithmForm
