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
import * as yup from 'yup'

/**
 * The internal imports
 */
import FormProvider from '../formProvider'
import Number from '../inputs/number'
import Select from '../inputs/select'
import {
  useGetConditionQuery,
  useUpdateConditionMutation,
} from '@/lib/api/modules/enhanced/condition.enhanced'
import { useToast } from '@/lib/hooks'
import type { ConditionFormComponent, ConditionInputs } from '@/types'

const ConditionForm: ConditionFormComponent = ({
  conditionId,
  close,
  callback,
}) => {
  const { t } = useTranslation('decisionTrees')
  const { newToast } = useToast()

  const cutOffValueTypesOptions = useConst(() => [
    {
      value: 'months',
      label: t('enum.cutOffValueTypes.months'),
    },
    {
      value: 'days',
      label: t('enum.cutOffValueTypes.days'),
    },
  ])

  const methods = useForm<ConditionInputs>({
    resolver: yupResolver(
      yup.object({
        cutOffStart: yup
          .number()
          .label(t('cutOffStart'))
          .transform(value => (isNaN(value) ? null : value))
          .nullable(),
        cutOffEnd: yup
          .number()
          .label(t('cutOffEnd'))
          .moreThan(yup.ref('cutOffStart'))
          .transform(value => (isNaN(value) ? null : value))
          .nullable(),
        cutOffValueType: yup.string().label(t('cutOffValueType')).required(),
      })
    ),
    reValidateMode: 'onSubmit',
    defaultValues: {
      cutOffStart: null,
      cutOffEnd: null,
      cutOffValueType: 'days',
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
   * Removes the cutoffs and updates the condition in the api
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
        message: t('notifications.updateSuccess', { ns: 'common' }),
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
            <Select name='cutOffValueType' options={cutOffValueTypesOptions} />
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
              data-cy='submit'
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
