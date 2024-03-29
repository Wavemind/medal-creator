/**
 * The external imports
 */
import React, { ReactElement, useEffect } from 'react'
import { serverSideTranslations } from 'next-i18next/serverSideTranslations'
import { useForm } from 'react-hook-form'
import { useTranslation } from 'next-i18next'
import { yupResolver } from '@hookform/resolvers/yup'
import { Heading, Box, VStack, Button } from '@chakra-ui/react'
import { Link } from '@chakra-ui/next-js'
import * as yup from 'yup'
import type { GetServerSideProps } from 'next'

/**
 * The internal imports
 */
import AuthLayout from '@/lib/layouts/auth'
import Input from '@/components/inputs/input'
import { useNewPasswordMutation } from '@/lib/api/modules/session'
import { useAppRouter } from '@/lib/hooks/useAppRouter'
import FormProvider from '@/components/formProvider'
import type { UpdatePasswordMutationVariables } from '@/lib/api/modules/generated/user.generated'

export default function NewPassword() {
  const { t } = useTranslation('newPassword')
  const router = useAppRouter()
  const methods = useForm<UpdatePasswordMutationVariables>({
    resolver: yupResolver(
      yup.object({
        password: yup.string().label(t('password')).required(),
        passwordConfirmation: yup
          .string()
          .label(t('passwordConfirmation'))
          .required(),
      })
    ),
    reValidateMode: 'onSubmit',
    defaultValues: {
      password: '',
      passwordConfirmation: '',
    },
  })

  const [setNewPassword, { isSuccess, isError, error, isLoading }] =
    useNewPasswordMutation()

  /**
   * Handles the form submit and dispatches the new password action
   * @param values { password, passwordConfirmation }
   */
  const changePassword = (values: UpdatePasswordMutationVariables) => {
    setNewPassword({ values, query: router.query })
  }

  useEffect(() => {
    if (isSuccess) {
      router.push('/auth/sign-in?notifications=new_password')
    }
  }, [isSuccess])

  return (
    <React.Fragment>
      <Heading variant='h2' mb={14} textAlign='center'>
        {t('forgotPassword')}
      </Heading>
      <FormProvider<UpdatePasswordMutationVariables>
        methods={methods}
        isError={isError}
        error={error}
      >
        <form onSubmit={methods.handleSubmit(changePassword)}>
          <VStack align='left' spacing={6}>
            <Input
              type='password'
              label={t('password')}
              name='password'
              helperText={t('passwordHint', { ns: 'acceptInvitation' })}
              isRequired
            />
            <Input
              type='password'
              label={t('passwordConfirmation')}
              name='passwordConfirmation'
              helperText={t('passwordHint', { ns: 'acceptInvitation' })}
              isRequired
            />
          </VStack>
          <Button
            data-testid='submit'
            type='submit'
            w='full'
            mt={6}
            isLoading={isLoading}
          >
            {t('save', { ns: 'common' })}
          </Button>
        </form>
      </FormProvider>
      <Box mt={8}>
        <Link href='/auth/sign-in' fontSize='sm' data-testid='sign-in'>
          {t('signIn')}
        </Link>
      </Box>
    </React.Fragment>
  )
}

export const getStaticProps: GetServerSideProps = async ({ locale }) => ({
  props: {
    ...(await serverSideTranslations(locale as string, [
      'newPassword',
      'acceptInvitation',
      'validations',
      'common',
    ])),
  },
})

NewPassword.getLayout = function getLayout(page: ReactElement) {
  return <AuthLayout namespace='newPassword'>{page}</AuthLayout>
}
