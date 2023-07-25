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
import { FormProvider, Number, Select } from '@/components'
import {
  useGetConditionQuery,
  useUpdateConditionMutation,
} from '@/lib/api/modules'
import { useToast } from '@/lib/hooks'
import type { ConditionFormComponent, ConditionInputs } from '@/types'

const ConditionForm: ConditionFormComponent = ({ conditionId, close }) => {
  const { t } = useTranslation('decisionTrees')
  const { newToast } = useToast()
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
      isSuccess: isUpdateConditionSuccess,
      isError: isUpdateConditionError,
      error: updateConditionError,
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
    if (isUpdateConditionSuccess) {
      newToast({
        message: t('notifications.updateSuccess', { ns: 'common' }),
        status: 'success',
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
            <Number name='cutOffEnd' min={0} />
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
              <Button variant='delete' onClick={onRemove}>
                {t('remove', { ns: 'common' })}
              </Button>
            )}
            <Button
              type='submit'
              data-cy='submit'
              isLoading={methods.formState.isSubmitting}
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
