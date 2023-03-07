/**
 * The external imports
 */
import { useEffect, useContext, FC, useState } from 'react'
import { FormProvider, SubmitHandler, useForm } from 'react-hook-form'
import { useTranslation } from 'next-i18next'
import { VStack, Button, HStack, Box } from '@chakra-ui/react'
import { yupResolver } from '@hookform/resolvers/yup'
import { skipToken } from '@reduxjs/toolkit/dist/query'
import * as yup from 'yup'

/**
 * The internal imports
 */
import { Slider, Input, Textarea, ErrorMessage, Dropzone } from '@/components'
import {
  useGetProjectQuery,
  useCreateDiagnosisMutation,
  useUpdateDiagnosisMutation,
  useGetDiagnosisQuery,
} from '@/lib/services/modules'
import { useToast } from '@/lib/hooks'
import { ModalContext } from '@/lib/contexts'
import { HSTORE_LANGUAGES } from '@/lib/config/constants'
import type { Project, DiagnosisInputs, StringIndexType, AttachedFile } from '@/types'

/**
 * Type definitions
 */
type DiagnosisFormProps = {
  projectId: number
  decisionTreeId?: number
  diagnosisId?: number
  setDiagnosisId?: React.Dispatch<React.SetStateAction<number | undefined>>
  nextStep?: () => void
}

const DiagnosisForm: FC<DiagnosisFormProps> = ({
  projectId,
  decisionTreeId,
  diagnosisId = null,
  setDiagnosisId,
  nextStep = null,
}) => {
  const { t } = useTranslation('diagnoses')
  const { newToast } = useToast()
  const { closeModal } = useContext(ModalContext)

  const [filesToUpload, setFilesToUpload] = useState<AttachedFile[]>([])

  const { data: project = {} as Project } = useGetProjectQuery(projectId)

  const {
    data: diagnosis,
    isSuccess: isGetDiagnosisSuccess,
    isError: isGetDiagnosisError,
    error: getDiagnosisError,
  } = useGetDiagnosisQuery(diagnosisId ?? skipToken)

  const [
    createDiagnosis,
    {
      isSuccess: isCreateDiagnosisSuccess,
      isError: isCreateDiagnosisError,
      error: createDiagnosisError,
      isLoading: isCreateDiagnosisLoading,
    },
  ] = useCreateDiagnosisMutation()

  const [
    updateDiagnosis,
    {
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
      levelOfUrgency: 1,
      decisionTreeId: decisionTreeId,
    },
  })

  /**
   * Create or update a decision tree with data passed in params
   * @param {} data
   */
  const onSubmit: SubmitHandler<DiagnosisInputs> = data => {
    const descriptionTranslations: StringIndexType = {}
    const labelTranslations: StringIndexType = {}
    HSTORE_LANGUAGES.forEach(language => {
      descriptionTranslations[language] =
        language === project.language.code && data.description
          ? data.description
          : ''
    })

    HSTORE_LANGUAGES.forEach(language => {
      labelTranslations[language] =
        language === project.language.code && data.label ? data.label : ''
    })

    delete data.description
    delete data.label

    if (diagnosisId) {
      const existingFiles = filesToUpload.filter(file => file.id)
      const newFiles = filesToUpload.filter(file => !file.id)

      updateDiagnosis({
        id: diagnosisId,
        descriptionTranslations,
        labelTranslations,
        existingFiles,
        newFiles,
        ...data,
      })
    } else {
      createDiagnosis({
        labelTranslations,
        descriptionTranslations,
        newFiles: filesToUpload,
        ...data,
      })
    }
  }

  /**
   * If the getDiagnosis query is successful, reset
   * the form with the existing diagnosis values
   */
  useEffect(() => {
    if (isGetDiagnosisSuccess) {
      methods.reset({
        label: diagnosis.labelTranslations[project.language.code],
        description: diagnosis.descriptionTranslations[project.language.code],
        levelOfUrgency: diagnosis.levelOfUrgency,
      })
    }
  }, [isGetDiagnosisSuccess])

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

  /**
   * If update successful, queue the toast and move to the next step
   */
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
        closeModal()
      }
    }
  }, [isUpdateDiagnosisSuccess])

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

          <Dropzone
            label={t('mediaUpload')}
            name='mediaUpload'
            multiple
            acceptedFileTypes={{
              'audio/aac': [],
              'audio/amr': [],
              'audio/flac': [],
              'audio/mpeg': ['.mp3'],
              'audio/ogg': [],
              'audio/wav': [],
              'video/mp4': ['.m4a'],
              'video/mp2t': ['.ts'],
              'video/wav': [],
              'video/3gpp': ['.3gp'],
              'video/x-matroska': ['.mkv'],
              'video/webm': [],
              'image/bmp': [],
              'image/gif': [],
              'image/jpeg': ['.jpg', '.jpeg'],
              'image/png': [],
              'image/webp': [],
              'image/heic': [],
              'image/heif': [],
            }}
            filesToUpload={filesToUpload}
            setFilesToUpload={setFilesToUpload}
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

export default DiagnosisForm
