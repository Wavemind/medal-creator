/**
 * The external imports
 */
import { useEffect, useState } from 'react'
import { useTranslation } from 'next-i18next'
import { Button, HStack, Spinner, VStack } from '@chakra-ui/react'
import { yupResolver } from '@hookform/resolvers/yup'
import { SubmitHandler, useForm } from 'react-hook-form'
import { skipToken } from '@reduxjs/toolkit/dist/query'

/**
 * The internal imports
 */
import Checkbox from '@/components/inputs/checkbox'
import Dropzone from '@/components/inputs/dropzone'
import FormProvider from '@/components/formProvider'
import Input from '@/components/inputs/input'
import Slider from '@/components/inputs/slider'
import Textarea from '@/components/inputs/textarea'
import {
  useCreateManagementMutation,
  useGetManagementQuery,
  useUpdateManagementMutation,
} from '@/lib/api/modules/enhanced/management.enhanced'
import { useGetProjectQuery } from '@/lib/api/modules/enhanced/project.enhanced'
import ManagementService from '@/lib/services/management.service'
import { useModal } from '@/lib/hooks'
import {
  FILE_EXTENSIONS_AUTHORIZED,
  HSTORE_LANGUAGES,
} from '@/lib/config/constants'
import { extractTranslation } from '@/lib/utils/string'
import type {
  ManagementFormComponent,
  ManagementInputs,
  Languages,
} from '@/types'

const ManagementForm: ManagementFormComponent = ({
  projectId,
  managementId,
}) => {
  const { t } = useTranslation('managements')
  const { close } = useModal()

  const [filesToAdd, setFilesToAdd] = useState<File[]>([])
  const [existingFilesToRemove, setExistingFilesToRemove] = useState<number[]>(
    []
  )

  const {
    data: management,
    isSuccess: isGetManagementSuccess,
    isError: isGetManagementError,
    error: getManagementError,
  } = useGetManagementQuery(managementId ? { id: managementId } : skipToken)

  const [
    createManagement,
    {
      isSuccess: isCreateManagementSuccess,
      isError: isCreateManagementError,
      error: createManagementError,
      isLoading: isCreateManagementLoading,
    },
  ] = useCreateManagementMutation()

  const [
    updateManagement,
    {
      isSuccess: isUpdateManagementSuccess,
      isError: isUpdateManagementError,
      error: updateManagementError,
      isLoading: isUpdateManagementLoading,
    },
  ] = useUpdateManagementMutation()

  const { data: project, isSuccess: isGetProjectSuccess } = useGetProjectQuery({
    id: projectId,
  })

  const methods = useForm<ManagementInputs>({
    resolver: yupResolver(ManagementService.getValidationSchema(t)),
    reValidateMode: 'onSubmit',
    defaultValues: {
      label: '',
      description: '',
      levelOfUrgency: 5,
      isReferral: false,
      isNeonat: false,
    },
  })

  useEffect(() => {
    if (isGetManagementSuccess && isGetProjectSuccess) {
      methods.reset({
        label: extractTranslation(
          management.labelTranslations,
          project.language.code
        ),
        description: extractTranslation(
          management.descriptionTranslations,
          project.language.code
        ),
        levelOfUrgency: management.levelOfUrgency,
        isReferral: management.isReferral,
        isNeonat: management.isNeonat,
      })
    }
  }, [isGetManagementSuccess])

  /**
   * Create or update a management with data passed in params
   * @param {} data
   */
  const onSubmit: SubmitHandler<ManagementInputs> = data => {
    const transformedData = ManagementService.transformData(
      data,
      project?.language.code
    )

    // TODO : Correct this type
    // Check node_input_type which states description translation is not required, but the form states it does
    if (managementId) {
      updateManagement({
        id: managementId,
        filesToAdd,
        existingFilesToRemove,
        ...transformedData,
      })
    } else {
      createManagement({
        filesToAdd,
        projectId,
        ...transformedData,
      })
    }
  }

  if (isGetProjectSuccess) {
    return (
      <FormProvider<ManagementInputs>
        methods={methods}
        isError={
          isCreateManagementError ||
          isUpdateManagementError ||
          isGetManagementError
        }
        error={{
          ...createManagementError,
          ...updateManagementError,
          ...getManagementError,
        }}
        isSuccess={isCreateManagementSuccess || isUpdateManagementSuccess}
        callbackAfterSuccess={close}
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
            <Checkbox label={t('isNeonat')} name='isNeonat' />
            <Checkbox label={t('isReferral')} name='isReferral' />
            <Slider name='levelOfUrgency' label={t('levelOfUrgency')} />
            <Dropzone
              label={t('dropzone.mediaUpload', { ns: 'common' })}
              name='mediaUpload'
              multiple
              acceptedFileTypes={FILE_EXTENSIONS_AUTHORIZED}
              existingFiles={management?.files || []}
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
                isLoading={
                  isCreateManagementLoading || isUpdateManagementLoading
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

  return <Spinner size='xl' />
}

export default ManagementForm
