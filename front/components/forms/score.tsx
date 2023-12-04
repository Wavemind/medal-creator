/**
 * The external imports
 */
import { useEffect } from 'react'
import { useTranslation } from 'next-i18next'
import { Button, Spinner, VStack } from '@chakra-ui/react'
import { SubmitHandler, useForm } from 'react-hook-form'
import { yupResolver } from '@hookform/resolvers/yup'

/**
 * The internal imports
 */
import FormProvider from '@/components/formProvider'
import Number from '../inputs/number'
import {
  useGetConditionQuery,
  useUpdateConditionMutation,
} from '@/lib/api/modules/enhanced/condition.enhanced'
import { useToast } from '@/lib/hooks'
import ConditionService from '@/lib/services/condition.service'
import type { ScoreInputs, ScoreFormComponent } from '@/types'

const ScoreForm: ScoreFormComponent = ({ conditionId, close, callback }) => {
  const { t } = useTranslation('questionsSequence')
  const { newToast } = useToast()

  const methods = useForm<ScoreInputs>({
    resolver: yupResolver(ConditionService.getScoreValidationSchema(t)),
    reValidateMode: 'onSubmit',
    defaultValues: {
      score: null,
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
      methods.reset(ConditionService.buildScoreFormData(condition))
    }
  }, [isGetConditionSuccess, condition])

  /**
   * Updates the cut off values for the condition
   * @param data ConditionInputs
   */
  const onSubmit: SubmitHandler<ScoreInputs> = data => {
    updateCondition({
      id: conditionId,
      score: data.score,
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
        score: updatedCondition.score,
      })
      close()
    }
  }, [isUpdateConditionSuccess])

  if (isGetConditionSuccess && condition) {
    return (
      <FormProvider<ScoreInputs>
        methods={methods}
        isError={isUpdateConditionError}
        error={updateConditionError}
      >
        <form onSubmit={methods.handleSubmit(onSubmit)}>
          <VStack alignItems='flex-start' spacing={4}>
            <Number label={t('score')} name='score' />
            <Button
              type='submit'
              data-testid='submit'
              isLoading={isUpdateConditionLoading}
            >
              {t('save', { ns: 'common' })}
            </Button>
          </VStack>
        </form>
      </FormProvider>
    )
  }

  return <Spinner size='xl' />
}

export default ScoreForm
