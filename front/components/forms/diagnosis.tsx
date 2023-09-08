/**
 * The external imports
 */
import { useEffect, useState } from 'react'
import { SubmitHandler, useForm } from 'react-hook-form'
import { useTranslation } from 'next-i18next'
import { VStack, Button, HStack, Spinner } from '@chakra-ui/react'
import { yupResolver } from '@hookform/resolvers/yup'
import { skipToken } from '@reduxjs/toolkit/dist/query'
import * as yup from 'yup'

/**
 * The internal imports
 */
import FormProvider from '@/components/formProvider'
import Slider from '@/components/inputs/slider'
import Input from '@/components/inputs/input'
import Textarea from '@/components/inputs/textarea'
import Dropzone from '@/components/inputs/dropzone'
import { useGetProjectQuery } from '@/lib/api/modules/enhanced/project.enhanced'
import {
  useCreateDiagnosisMutation,
  useUpdateDiagnosisMutation,
  useGetDiagnosisQuery,
} from '@/lib/api/modules/enhanced/diagnosis.enhanced'
import { useModal } from '@/lib/hooks'
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
  const { close } = useModal()

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

  const handleSuccess = () => {
    if (nextStep) {
      if (setDiagnosisId) {
        setDiagnosisId(undefined)
      }
      nextStep()
    } else {
      if (callback) {
        callback(diagnosisId ? updatedDiagnosis : newDiagnosis)
      }
      close()
    }
  }

  if (isGetProjectSuccess) {
    return (
      <FormProvider<DiagnosisInputs>
        methods={methods}
        isError={
          isCreateDiagnosisError ||
          isUpdateDiagnosisError ||
          isGetDiagnosisError
        }
        error={{
          ...createDiagnosisError,
          ...updateDiagnosisError,
          ...getDiagnosisError,
        }}
        isSuccess={isCreateDiagnosisSuccess || isUpdateDiagnosisSuccess}
        callbackAfterSuccess={handleSuccess}
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
            <HStack justifyContent='flex-end'>
              <Button
                type='submit'
                data-testid='submit'
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
