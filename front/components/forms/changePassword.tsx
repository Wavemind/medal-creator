/**
 * The external imports
 */
import { useForm } from 'react-hook-form'
import { useTranslation } from 'next-i18next'
import { VStack, Button, HStack } from '@chakra-ui/react'
import { yupResolver } from '@hookform/resolvers/yup'
import * as yup from 'yup'

/**
 * The internal imports
 */
import Input from '@/components/inputs/input'
import FormProvider from '@/components/formProvider'
import { useUpdatePasswordMutation } from '@/lib/api/modules/enhanced/user.enhanced'
import type { AuthComponent } from '@/types'
import type { UpdatePasswordMutationVariables } from '@/lib/api/modules/generated/user.generated'

const ChangePassword: AuthComponent = ({ userId }) => {
  const { t } = useTranslation('account')

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

  return (
    <FormProvider<UpdatePasswordMutationVariables>
      methods={methods}
      isError={isError}
      error={error}
      isSuccess={isSuccess}
    >
      <form onSubmit={methods.handleSubmit(updatePassword)}>
        <VStack align='left' spacing={12}>
          <Input
            label={t('credentials.password')}
            name='password'
            type='password'
            helperText={t('passwordHint', { ns: 'acceptInvitation' })}
            isRequired
            data-testid='new-password'
          />
          <Input
            label={t('credentials.passwordConfirmation')}
            name='passwordConfirmation'
            helperText={t('passwordHint', { ns: 'acceptInvitation' })}
            type='password'
            isRequired
          />
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
