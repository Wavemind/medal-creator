/**
 * The external imports
 */
import { FC, useEffect } from 'react'
import { useForm, FormProvider } from 'react-hook-form'
import { useTranslation } from 'next-i18next'
import { VStack, Button, Box, HStack } from '@chakra-ui/react'
import { yupResolver } from '@hookform/resolvers/yup'
import * as yup from 'yup'

/**
 * The internal imports
 */
import { Input, ErrorMessage } from '@/components'
import { useToast } from '@/lib/hooks'
import { useUpdatePasswordMutation } from '@/lib/services/modules/user'
import type { PasswordInputs } from '@/types/session'
import type { CredentialsProps } from '@/types/twoFactor'

const ChangePassword: FC<CredentialsProps> = ({ userId }) => {
  const { t } = useTranslation(['account', 'common'])
  const { newToast } = useToast()

  const [updatePassword, { isSuccess, isLoading, isError, error }] =
    useUpdatePasswordMutation()

  /**
   * Setup form configuration
   */
  const methods = useForm<PasswordInputs>({
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
      password: '',
      passwordConfirmation: '',
    },
  })

  /**
   * Sends the data to the backend to update the password
   */
  const handleUpdatePassword = (data: PasswordInputs) => {
    updatePassword({
      id: userId,
      ...data,
    })
  }

  useEffect(() => {
    if (isSuccess) {
      newToast({
        message: t('notifications.updateSuccess', { ns: 'common' }),
        status: 'success',
      })
    }
  }, [isSuccess])

  return (
    <FormProvider {...methods}>
      <form onSubmit={methods.handleSubmit(handleUpdatePassword)}>
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
