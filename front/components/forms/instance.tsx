/**
 * The external imports
 */
import { useEffect } from 'react'
import { useTranslation } from 'next-i18next'
import { Button, HStack, VStack } from '@chakra-ui/react'
import { yupResolver } from '@hookform/resolvers/yup'
import { SubmitHandler, useForm } from 'react-hook-form'
import { skipToken } from '@reduxjs/toolkit/dist/query/react'

/**
 * The internal imports
 */
import Checkbox from '@/components/inputs/checkbox'
import FormProvider from '@/components/formProvider'
import Input from '@/components/inputs/input'
import Textarea from '@/components/inputs/textarea'
import InstanceService from '@/lib/services/instance.service'
import { useModal, useProject } from '@/lib/hooks'
import {
  useCreateInstanceMutation,
  useGetInstanceQuery,
  useUpdateInstanceMutation,
} from '@/lib/api/modules/enhanced/instance.enhanced'
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

  const {
    data: instance,
    isSuccess: isGetInstanceSuccess,
    isError: isGetInstanceError,
    error: getInstanceError,
  } = useGetInstanceQuery(instanceId ? { id: instanceId } : skipToken)

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

  const [
    updateInstance,
    {
      data: updatedInstance,
      isSuccess: isUpdateInstanceSuccess,
      isError: isUpdateInstanceError,
      error: updateInstanceError,
      isLoading: isUpdateInstanceLoading,
    },
  ] = useUpdateInstanceMutation()

  const methods = useForm<InstanceInputs>({
    resolver: yupResolver(InstanceService.getValidationSchema(t)),
    reValidateMode: 'onSubmit',
    defaultValues: {
      diagnosisId,
      duration: '',
      description: '',
      isPreReferral: false,
      positionX,
      positionY,
    },
  })

  const watchIsPreReferral = methods.watch('isPreReferral')
  const watchDuration = methods.watch('duration')

  useEffect(() => {
    if (isGetInstanceSuccess) {
      methods.reset(InstanceService.buildFormData(instance, projectLanguage))
    }
  }, [isGetInstanceSuccess, instance])

  /**
   * Create or update an instance with data passed in params
   * @param {} data
   */
  const onSubmit: SubmitHandler<InstanceInputs> = data => {
    const transformedData = InstanceService.transformData(data, projectLanguage)

    if (instanceId) {
      updateInstance({
        ...transformedData,
        id: instanceId,
      })
    } else {
      createInstance({
        ...transformedData,
        nodeId,
        instanceableId,
        instanceableType,
      })
    }
  }

  const handleSuccess = () => {
    const nodeToReturn = newInstance || updatedInstance
    if (callback && nodeToReturn) {
      callback(nodeToReturn)
    }

    closeModal()
  }

  useEffect(() => {
    if (watchIsPreReferral) {
      methods.setValue('duration', '')
    }

    if (watchDuration !== '') {
      methods.setValue('isPreReferral', false)
    }
  }, [watchIsPreReferral, watchDuration])

  return (
    <FormProvider<InstanceInputs>
      methods={methods}
      isError={
        isCreateInstanceError || isGetInstanceError || isUpdateInstanceError
      }
      error={{
        ...createInstanceError,
        ...getInstanceError,
        ...updateInstanceError,
      }}
      isSuccess={isCreateInstanceSuccess || isUpdateInstanceSuccess}
      callbackAfterSuccess={handleSuccess}
    >
      <form onSubmit={methods.handleSubmit(onSubmit)}>
        <VStack align='left' spacing={8}>
          <Checkbox
            label={t('isPreReferral')}
            name='isPreReferral'
            isDisabled={!!watchDuration}
          />
          <Input
            name='duration'
            label={t('duration')}
            isDisabled={!!watchIsPreReferral}
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
              isLoading={isCreateInstanceLoading || isUpdateInstanceLoading}
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
