/**
 * The external imports
 */
import { useEffect, useState } from 'react'
import { SubmitHandler, useForm } from 'react-hook-form'
import { useTranslation } from 'next-i18next'
import { VStack, Button, HStack } from '@chakra-ui/react'
import { yupResolver } from '@hookform/resolvers/yup'
import { skipToken } from '@reduxjs/toolkit/dist/query'

/**
 * The internal imports
 */
import FormProvider from '@/components/formProvider'
import Slider from '@/components/inputs/slider'
import Input from '@/components/inputs/input'
import Textarea from '@/components/inputs/textarea'
import Dropzone from '@/components/inputs/dropzone'
import DiagnosisService from '@/lib/services/diagnosis.service'
import {
  useCreateDiagnosisMutation,
  useUpdateDiagnosisMutation,
  useGetDiagnosisQuery,
} from '@/lib/api/modules/enhanced/diagnosis.enhanced'
import { useModal } from '@/lib/hooks/useModal'
import { useProject } from '@/lib/hooks/useProject'
import { FILE_EXTENSIONS_AUTHORIZED } from '@/lib/config/constants'
import type { DiagnosisInputs, DiagnosisFormComponent } from '@/types'

const DiagnosisForm: DiagnosisFormComponent = ({
  decisionTreeId,
  diagnosisId = null,
  setDiagnosisId,
  nextStep = null,
  callback,
}) => {
  const { t } = useTranslation('diagnoses')
  const { close } = useModal()
  const { projectLanguage } = useProject()

  const [filesToAdd, setFilesToAdd] = useState<File[]>([])
  const [existingFilesToRemove, setExistingFilesToRemove] = useState<number[]>(
    []
  )

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
    resolver: yupResolver(DiagnosisService.getValidationSchema(t)),
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
    const transformedData = DiagnosisService.transformData(
      data,
      projectLanguage
    )

    if (diagnosisId) {
      updateDiagnosis({
        ...transformedData,
        id: diagnosisId,
        existingFilesToRemove,
        filesToAdd,
      })
    } else if (decisionTreeId) {
      createDiagnosis({
        ...transformedData,
        filesToAdd,
        decisionTreeId,
      })
    }
  }

  /**
   * If the getDiagnosis query is successful, reset
   * the form with the existing diagnosis values
   */
  useEffect(() => {
    if (isGetDiagnosisSuccess) {
      methods.reset(DiagnosisService.buildFormData(diagnosis, projectLanguage))
    }
  }, [isGetDiagnosisSuccess, diagnosis])

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

  return (
    <FormProvider<DiagnosisInputs>
      methods={methods}
      isError={
        isCreateDiagnosisError || isUpdateDiagnosisError || isGetDiagnosisError
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
              language: t(`languages.${projectLanguage}`, {
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
              language: t(`languages.${projectLanguage}`, {
                ns: 'common',
                defaultValue: '',
              }),
              ns: 'common',
            })}
          />
          <Slider
            name='levelOfUrgency'
            label={t('levelOfUrgency')}
            isDisabled={diagnosis?.isDeployed}
          />
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

export default DiagnosisForm
