/**
 * The external imports
 */
import { useEffect } from 'react'
import { useTranslation } from 'next-i18next'
import {
  Button,
  HStack,
  VStack,
  Spinner,
  Text,
  useConst,
} from '@chakra-ui/react'
import { SubmitHandler, useForm } from 'react-hook-form'
import { yupResolver } from '@hookform/resolvers/yup'

/**
 * The internal imports
 */
import FormProvider from '@/components/formProvider'
import Number from '@/components/inputs/number'
import Select from '@/components/inputs/select'
import {
  useGetConditionQuery,
  useUpdateConditionMutation,
} from '@/lib/api/modules/enhanced/condition.enhanced'
import { useToast } from '@/lib/hooks'
import {
  CutOffValueTypesEnum,
  type ConditionFormComponent,
  type ConditionInputs,
} from '@/types'
import conditionService from '@/lib/services/condition.service'

const ConditionForm: ConditionFormComponent = ({
  conditionId,
  close,
  callback,
}) => {
  const { t } = useTranslation('decisionTrees')
  const { newToast } = useToast()

  const cutOffValueTypesOptions = useConst(() =>
    Object.values(CutOffValueTypesEnum).map(cutOffValue => ({
      value: cutOffValue,
      label: t(`enum.cutOffValueTypes.${cutOffValue}`),
    }))
  )

  const methods = useForm<ConditionInputs>({
    resolver: yupResolver(conditionService.getValidationSchema(t)),
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
      methods.reset({
        cutOffStart: condition.cutOffStart,
        cutOffEnd: condition.cutOffEnd,
      })
    }
  }, [isGetConditionSuccess])

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
          <VStack alignItems='flex-start' spacing={4} mb={4}>
            <Text>{t('cutOffsFrom')}</Text>
            <Number name='cutOffStart' min={0} />
            <Text textAlign='center'>{t('cutOffsTo')}</Text>
            <Number name='cutOffEnd' min={0} />;
            <Text textAlign='center'>{t('in')}</Text>
            <Select
              name='cutOffValueType'
              options={cutOffValueTypesOptions}
              isRequired
            />
          </VStack>
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
