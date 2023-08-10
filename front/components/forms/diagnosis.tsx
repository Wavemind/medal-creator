/**
 * The external imports
 */
import { useEffect, useContext, useState } from 'react'
import { SubmitHandler, useForm } from 'react-hook-form'
import { useTranslation } from 'next-i18next'
import { VStack, Button, HStack, Box, Spinner } from '@chakra-ui/react'
import { yupResolver } from '@hookform/resolvers/yup'
import { skipToken } from '@reduxjs/toolkit/dist/query'
import * as yup from 'yup'

/**
 * The internal imports
 */
import FormProvider from '../formProvider'
import Slider from '../inputs/slider'
import Input from '../inputs/input'
import Textarea from '../inputs/textarea'
import ErrorMessage from '../errorMessage'
import Dropzone from '../inputs/dropzone'
import {
  useGetProjectQuery,
  useCreateDiagnosisMutation,
  useUpdateDiagnosisMutation,
  useGetDiagnosisQuery,
} from '@/lib/api/modules'
import { useToast } from '@/lib/hooks'
import { ModalContext } from '@/lib/contexts'
import {
  FILE_EXTENSIONS_AUTHORIZED,
  HSTORE_LANGUAGES,
} from '@/lib/config/constants'
import { extractTranslation } from '@/lib/utils/string'
import type {
  DiagnosisInputs,
  DiagnosisFormComponent,
  Languages,
} from '@/types'

const DiagnosisForm: DiagnosisFormComponent = ({
  projectId,
  decisionTreeId,
  diagnosisId = null,
  setDiagnosisId,
  nextStep = null,
  callback,
}) => {
  const { t } = useTranslation('diagnoses')
  const { newToast } = useToast()
  const { close } = useContext(ModalContext)

  const [filesToAdd, setFilesToAdd] = useState<File[]>([])
  const [existingFilesToRemove, setExistingFilesToRemove] = useState<number[]>(
    []
  )

  const { data: project, isSuccess: isGetProjectSuccess } = useGetProjectQuery({
    id: projectId,
  })

  const {
    data: diagnosis,
    isSuccess: isGetDiagnosisSuccess,
    isError: isGetDiagnosisError,
    error: getDiagnosisError,
  } = useGetDiagnosisQuery(diagnosisId ? { id: diagnosisId } : skipToken)

  const [
    createDiagnosis,
    {
      data: newDiagnosis,
      isSuccess: isCreateDiagnosisSuccess,
      isError: isCreateDiagnosisError,
      error: createDiagnosisError,
      isLoading: isCreateDiagnosisLoading,
    },
  ] = useCreateDiagnosisMutation()

  const [
    updateDiagnosis,
    {
      data: updatedDiagnosis,
      isSuccess: isUpdateDiagnosisSuccess,
      isError: isUpdateDiagnosisError,
      error: updateDiagnosisError,
      isLoading: isUpdateDiagnosisLoading,
    },
  ] = useUpdateDiagnosisMutation()

  const methods = useForm<DiagnosisInputs>({
    resolver: yupResolver(
      yup.object({
        label: yup.string().label(t('label')).required(),
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
      levelOfUrgency: 5,
    },
  })

  /**
   * Create or update a decision tree with data passed in params
   * @param {} data
   */
  const onSubmit: SubmitHandler<DiagnosisInputs> = data => {
    const tmpData = { ...data }
    const descriptionTranslations: Languages = {}
    const labelTranslations: Languages = {}
    HSTORE_LANGUAGES.forEach(language => {
      descriptionTranslations[language] =
        language === project?.language.code && tmpData.description
          ? tmpData.description
          : ''
    })

    HSTORE_LANGUAGES.forEach(language => {
      labelTranslations[language] =
        language === project?.language.code && tmpData.label
          ? tmpData.label
          : ''
    })

    delete tmpData.description
    delete tmpData.label

    if (diagnosisId) {
      updateDiagnosis({
        id: diagnosisId,
        descriptionTranslations,
        labelTranslations,
        existingFilesToRemove,
        filesToAdd,
        ...tmpData,
      })
    } else if (decisionTreeId) {
      createDiagnosis({
        labelTranslations,
        descriptionTranslations,
        filesToAdd,
        decisionTreeId,
        ...tmpData,
      })
    }
  }

  /**
   * If the getDiagnosis query is successful, reset
   * the form with the existing diagnosis values
   */
  useEffect(() => {
    if (isGetDiagnosisSuccess && isGetProjectSuccess) {
      methods.reset({
        label: extractTranslation(
          diagnosis.labelTranslations,
          project.language.code
        ),
        description: extractTranslation(
          diagnosis.descriptionTranslations,
          project.language.code
        ),
        levelOfUrgency: diagnosis.levelOfUrgency,
      })
    }
  }, [isGetDiagnosisSuccess])

  useEffect(() => {
    if (isCreateDiagnosisSuccess && newDiagnosis) {
      newToast({
        message: t('notifications.createSuccess', { ns: 'common' }),
        status: 'success',
      })
      if (nextStep) {
        nextStep()
      } else {
        if (callback) {
          callback(newDiagnosis)
        }
        close()
      }
    }
  }, [isCreateDiagnosisSuccess])

  useEffect(() => {
    if (isUpdateDiagnosisSuccess) {
      newToast({
        message: t('notifications.updateSuccess', { ns: 'common' }),
        status: 'success',
      })
      if (nextStep && setDiagnosisId) {
        setDiagnosisId(undefined)
        nextStep()
      } else {
        if (callback) {
          callback(updatedDiagnosis)
        }

        close()
      }
    }
  }, [isUpdateDiagnosisSuccess])

  if (isGetProjectSuccess) {
    return (
      <FormProvider<DiagnosisInputs>
        methods={methods}
        isError={isCreateDiagnosisError || isUpdateDiagnosisError}
        error={{ ...createDiagnosisError, ...updateDiagnosisError }}
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
            />
            <Slider name='levelOfUrgency' label={t('levelOfUrgency')} />
            <Dropzone
              label={t('dropzone.mediaUpload', { ns: 'common' })}
              name='mediaUpload'
              multiple
              acceptedFileTypes={FILE_EXTENSIONS_AUTHORIZED}
              existingFiles={diagnosis?.files || []}
              setExistingFilesToRemove={setExistingFilesToRemove}
              existingFilesToRemove={existingFilesToRemove}
              filesToAdd={filesToAdd}
              setFilesToAdd={setFilesToAdd}
            />

            {isCreateDiagnosisError && (
              <Box w='full'>
                <ErrorMessage error={createDiagnosisError} />
              </Box>
            )}
            {isUpdateDiagnosisError && (
              <Box w='full'>
                <ErrorMessage error={updateDiagnosisError} />
              </Box>
            )}
            {isGetDiagnosisError && (
              <Box w='full'>
                <ErrorMessage error={getDiagnosisError} />
              </Box>
            )}
            <HStack justifyContent='flex-end'>
              <Button
                type='submit'
                data-cy='submit'
                mt={6}
                isLoading={isCreateDiagnosisLoading || isUpdateDiagnosisLoading}
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

export default DiagnosisForm
