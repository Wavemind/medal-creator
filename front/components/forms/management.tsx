/**
 * The external imports
 */
import { useTranslation } from 'next-i18next'
import { Button, HStack, Spinner, VStack } from '@chakra-ui/react'
import { yupResolver } from '@hookform/resolvers/yup'
import { SubmitHandler, useForm } from 'react-hook-form'
import * as yup from 'yup'

/**
 * The internal imports
 */
import {
  Checkbox,
  Dropzone,
  FormProvider,
  Input,
  Slider,
  Textarea,
} from '@/components'
import { useGetProjectQuery } from '@/lib/api/modules'
import type { ManagementFormComponent, ManagementInputs } from '@/types'
import { FILE_EXTENSIONS_AUTHORIZED } from '@/lib/config/constants'
import { useState } from 'react'

const ManagementForm: ManagementFormComponent = ({ projectId }) => {
  const { t } = useTranslation('managements')

  const [filesToAdd, setFilesToAdd] = useState<File[]>([])
  const [existingFilesToRemove, setExistingFilesToRemove] = useState<number[]>(
    []
  )

  const { data: project, isSuccess: isGetProjectSuccess } =
    useGetProjectQuery(projectId)

  const methods = useForm<ManagementInputs>({
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
      isReferral: false,
      isNeonat: false,
      projectId: projectId,
    },
  })

  /**
   * Create or update a management with data passed in params
   * @param {} data
   */
  const onSubmit: SubmitHandler<ManagementInputs> = data => {
    console.log(data)
  }

  if (isGetProjectSuccess) {
    return (
      <FormProvider<ManagementInputs>
        methods={methods}
        isError={false}
        error={{}}
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
            <Checkbox label={t('isNeonat')} name='isPreFill' />
            <Checkbox label={t('isReferral')} name='isNeonat' />
            <Slider name='levelOfUrgency' label={t('levelOfUrgency')} />
            <Dropzone
              label={t('dropzone.mediaUpload', { ns: 'common' })}
              name='mediaUpload'
              multiple
              acceptedFileTypes={FILE_EXTENSIONS_AUTHORIZED}
              existingFiles={[]} // TODO ADD CURRENT EXISTING FILES
              setExistingFilesToRemove={setExistingFilesToRemove}
              existingFilesToRemove={existingFilesToRemove}
              filesToAdd={filesToAdd}
              setFilesToAdd={setFilesToAdd}
            />
            <HStack justifyContent='flex-end'>
              <Button
                type='submit'
                data-cy='submit'
                mt={6}
                // isLoading={isCreateDiagnosisLoading || isUpdateDiagnosisLoading}
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
