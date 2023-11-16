/**
 * The external imports
 */
import { useEffect, useState } from 'react'
import { useTranslation } from 'next-i18next'
import { Button, HStack, VStack } from '@chakra-ui/react'
import { yupResolver } from '@hookform/resolvers/yup'
import { SubmitHandler, useForm } from 'react-hook-form'

/**
 * The internal imports
 */
import Checkbox from '@/components/inputs/checkbox'
import FormProvider from '@/components/formProvider'
import Input from '@/components/inputs/input'
import Textarea from '@/components/inputs/textarea'

import InstanceService from '@/lib/services/instance.service'
import { useModal, useProject } from '@/lib/hooks'
import { useCreateInstanceMutation } from '@/lib/api/modules/enhanced/instance.enhanced'
import type { InstanceFormComponent, InstanceInputs } from '@/types'

const InstanceForm: InstanceFormComponent = ({
  instanceId,
  nodeId,
  instanceableId,
  instanceableType,
  diagnosisId,
  positionX,
  positionY,
  callback,
}) => {
  const { t } = useTranslation('instances')
  const { close: closeModal } = useModal()
  const { projectLanguage } = useProject()

  // const {
  //   data: management,
  //   isSuccess: isGetManagementSuccess,
  //   isError: isGetManagementError,
  //   error: getManagementError,
  // } = useGetManagementQuery(managementId ? { id: managementId } : skipToken)

  const [
    createInstance,
    {
      data: newInstance,
      isSuccess: isCreateInstanceSuccess,
      isError: isCreateInstanceError,
      error: createInstanceError,
      isLoading: isCreateInstanceLoading,
    },
  ] = useCreateInstanceMutation()

  // const [
  //   updateManagement,
  //   {
  //     data: updatedManagement,
  //     isSuccess: isUpdateManagementSuccess,
  //     isError: isUpdateManagementError,
  //     error: updateManagementError,
  //     isLoading: isUpdateManagementLoading,
  //   },
  // ] = useUpdateManagementMutation()

  const methods = useForm<InstanceInputs>({
    resolver: yupResolver(InstanceService.getValidationSchema(t)),
    reValidateMode: 'onSubmit',
    defaultValues: {
      diagnosisId,
      instanceableId,
      instanceableType,
      duration: '',
      description: '',
      isPreReferral: false,
      positionX,
      positionY,
      nodeId,
    },
  })

  // useEffect(() => {
  //   if (isGetManagementSuccess) {
  //     methods.reset({
  //       projectId,
  //       ...ManagementService.buildFormData(management, projectLanguage),
  //     })
  //   }
  // }, [isGetManagementSuccess, management])

  /**
   * Create or update an instance with data passed in params
   * @param {} data
   */
  const onSubmit: SubmitHandler<InstanceInputs> = data => {
    const transformedData = InstanceService.transformData(data, projectLanguage)
    console.log('ici ?', transformedData)
    if (instanceId) {
      // updateManagement({
      //   id: instanceId,
      //   filesToAdd,
      //   existingFilesToRemove,
      //   ...transformedData,
      // })
    } else {
      createInstance(transformedData)
    }
  }

  const handleSuccess = () => {
    const nodeToReturn = newInstance
    console.log('je rentre ici ?', nodeToReturn)
    if (callback && nodeToReturn) {
      callback(nodeToReturn)
    }

    closeModal()
  }

  return (
    <FormProvider<InstanceInputs>
      methods={methods}
      isError={isCreateInstanceError}
      error={{
        ...createInstanceError,
      }}
      isSuccess={isCreateInstanceSuccess}
      callbackAfterSuccess={handleSuccess}
    >
      <form onSubmit={methods.handleSubmit(onSubmit)}>
        <VStack align='left' spacing={8}>
          <Checkbox label={t('isPreReferral')} name='isPreReferral' />
          <Input
            name='duration'
            label={t('duration')}
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
          <HStack justifyContent='flex-end'>
            <Button
              type='submit'
              data-testid='submit'
              mt={6}
              isLoading={isCreateInstanceLoading}
            >
              {t('save', { ns: 'common' })}
            </Button>
          </HStack>
        </VStack>
      </form>
    </FormProvider>
  )
}

export default InstanceForm
