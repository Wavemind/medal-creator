/**
 * The external imports
 */
import { useContext, useEffect } from 'react'
import { useTranslation } from 'next-i18next'
import { Button, HStack, Spinner, Text, useConst } from '@chakra-ui/react'
import { SubmitHandler, useForm } from 'react-hook-form'
import { yupResolver } from '@hookform/resolvers/yup'
import * as yup from 'yup'

/**
 * The internal imports
 */
import { FormProvider, Input, Select } from '@/components'
import {
  useGetConditionQuery,
  useUpdateConditionMutation,
} from '@/lib/api/modules'
import { useToast } from '@/lib/hooks'
import { ModalContext } from '@/lib/contexts'
import type { ConditionFormComponent, ConditionInputs } from '@/types'

const ConditionForm: ConditionFormComponent = ({ conditionId }) => {
  const { t } = useTranslation('decisionTrees')
  const { newToast } = useToast()
  const { close } = useContext(ModalContext)
  const methods = useForm<ConditionInputs>({
    resolver: yupResolver(
      yup.object({
        cutOffStart: yup.string().label(t('cutOffStart')).required(),
        cutOffEnd: yup.string().label(t('cutOffEnd')).required(),
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

  const [updateCondition, { isSuccess: isUpdateConditionSuccess }] =
    useUpdateConditionMutation()

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

  if (isGetConditionSuccess) {
    return (
      <FormProvider<ConditionInputs>
        methods={methods}
        isError={false}
        error={{}}
      >
        <form onSubmit={methods.handleSubmit(onSubmit)}>
          <HStack alignItems='center' spacing={4} mb={4}>
            <Text w='md'>{t('cutOffsFrom')}</Text>
            <Input name='cutOffStart' />
            <Text textAlign='center' w='3xs'>
              {t('cutOffsTo')}
            </Text>
            <Input name='cutOffEnd' />
            <Select name='cutOffValueType' options={cutOffValueTypesOptions} />
          </HStack>
          <HStack justifyContent='flex-end'>
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
