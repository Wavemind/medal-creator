/**
 * The external imports
 */
import { useEffect } from 'react'
import { useForm } from 'react-hook-form'
import { useTranslation } from 'next-i18next'
import { VStack, Button, Box, HStack } from '@chakra-ui/react'
import { yupResolver } from '@hookform/resolvers/yup'
import * as yup from 'yup'

/**
 * The internal imports
 */
import Input from '../inputs/input'
import ErrorMessage from '../errorMessage'
import FormProvider from '../formProvider'
import { useToast } from '@/lib/hooks'
import { useUpdatePasswordMutation } from '@/lib/api/modules'
import type { AuthComponent } from '@/types'
import type { UpdatePasswordMutationVariables } from '@/lib/api/modules/generated/user.generated'

const ChangePassword: AuthComponent = ({ userId }) => {
  const { t } = useTranslation('account')
  const { newToast } = useToast()

  const [updatePassword, { isSuccess, isLoading, isError, error }] =
    useUpdatePasswordMutation()

  /**
   * Setup form configuration
   */
  const methods = useForm<UpdatePasswordMutationVariables>({
    resolver: yupResolver(
      yup.object({
        password: yup.string().label(t('credentials.password')).required(),
        passwordConfirmation: yup
          .string()
          .label(t('credentials.passwordConfirmation'))
          .required(),
      })
    ),
    reValidateMode: 'onSubmit',
    defaultValues: {
      id: userId,
      password: '',
      passwordConfirmation: '',
    },
  })

  useEffect(() => {
    if (isSuccess) {
      newToast({
        message: t('notifications.updateSuccess', { ns: 'common' }),
        status: 'success',
      })
    }
  }, [isSuccess])

  return (
    <FormProvider<UpdatePasswordMutationVariables>
      methods={methods}
      isError={isError}
      error={error}
    >
      <form onSubmit={methods.handleSubmit(updatePassword)}>
        <VStack align='left' spacing={12}>
          <Input
            label={t('credentials.password')}
            name='password'
            type='password'
            isRequired
            data-cy='change_password'
          />
          <Input
            label={t('credentials.passwordConfirmation')}
            name='passwordConfirmation'
            type='password'
            isRequired
          />

          <Box mt={6} textAlign='center'>
            {isError && <ErrorMessage error={error} />}
          </Box>
          <HStack justifyContent='flex-end'>
            <Button type='submit' mt={6} isLoading={isLoading}>
              {t('save', { ns: 'common' })}
            </Button>
          </HStack>
        </VStack>
      </form>
    </FormProvider>
  )
}

export default ChangePassword
