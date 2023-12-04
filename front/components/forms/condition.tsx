/**
 * The external imports
 */
import { useEffect } from 'react'
import { useTranslation } from 'next-i18next'
import { Button, HStack, Spinner } from '@chakra-ui/react'
import { SubmitHandler, useForm } from 'react-hook-form'
import { yupResolver } from '@hookform/resolvers/yup'

/**
 * The internal imports
 */
import FormProvider from '@/components/formProvider'
import {
  useGetConditionQuery,
  useUpdateConditionMutation,
} from '@/lib/api/modules/enhanced/condition.enhanced'
import { useToast } from '@/lib/hooks/useToast'
import ConditionService from '@/lib/services/condition.service'
import CutOff from '@/components/inputs/cutOff'
import {
  CutOffValueTypesEnum,
  type ConditionFormComponent,
  type ConditionInputs,
} from '@/types'

const ConditionForm: ConditionFormComponent = ({
  conditionId,
  close,
  callback,
}) => {
  const { t } = useTranslation('decisionTrees')
  const { newToast } = useToast()

  const methods = useForm<ConditionInputs>({
    resolver: yupResolver(ConditionService.getValidationSchema(t)),
    reValidateMode: 'onSubmit',
    defaultValues: {
      cutOffStart: null,
      cutOffEnd: null,
      cutOffValueType: CutOffValueTypesEnum.Days,
    },
  })

  const { data: condition, isSuccess: isGetConditionSuccess } =
    useGetConditionQuery({ id: conditionId })

  const [
    updateCondition,
    {
      data: updatedCondition,
      isSuccess: isUpdateConditionSuccess,
      isError: isUpdateConditionError,
      error: updateConditionError,
      isLoading: isUpdateConditionLoading,
    },
  ] = useUpdateConditionMutation()

  useEffect(() => {
    if (isGetConditionSuccess && condition) {
      methods.reset(ConditionService.buildFormData(condition))
    }
  }, [isGetConditionSuccess, condition])

  /**
   * Removes the cut offs and updates the condition in the api
   */
  const onRemove = () => {
    methods.reset({ cutOffStart: null, cutOffEnd: null })
    updateCondition({
      id: conditionId,
      cutOffStart: null,
      cutOffEnd: null,
    })
  }

  /**
   * Updates the cut off values for the condition
   * @param data ConditionInputs
   */
  const onSubmit: SubmitHandler<ConditionInputs> = data => {
    updateCondition({
      id: conditionId,
      cutOffStart: data.cutOffStart,
      cutOffEnd: data.cutOffEnd,
    })
  }

  useEffect(() => {
    if (
      isUpdateConditionSuccess &&
      updatedCondition &&
      !isUpdateConditionLoading
    ) {
      newToast({
        message: t('notifications.saveSuccess', { ns: 'common' }),
        status: 'success',
      })
      callback({
        cutOffStart: updatedCondition.cutOffStart,
        cutOffEnd: updatedCondition.cutOffEnd,
      })
      close()
    }
  }, [isUpdateConditionSuccess])

  if (isGetConditionSuccess && condition) {
    return (
      <FormProvider<ConditionInputs>
        methods={methods}
        isError={isUpdateConditionError}
        error={updateConditionError}
      >
        <form onSubmit={methods.handleSubmit(onSubmit)}>
          <CutOff columns={1} />
          <HStack
            justifyContent={
              condition.cutOffStart || condition.cutOffEnd
                ? 'space-between'
                : 'flex-end'
            }
          >
            {(condition.cutOffStart || condition.cutOffEnd) && (
              <Button
                variant='ghost'
                color='error'
                onClick={onRemove}
                isLoading={isUpdateConditionLoading}
              >
                {t('remove', { ns: 'common' })}
              </Button>
            )}
            <Button
              type='submit'
              data-testid='submit'
              isLoading={isUpdateConditionLoading}
            >
              {t('save', { ns: 'common' })}
            </Button>
          </HStack>
        </form>
      </FormProvider>
    )
  }

  return <Spinner size='xl' />
}

export default ConditionForm
