/**
 * The external imports
 */
import React, { useEffect } from 'react'
import { serverSideTranslations } from 'next-i18next/serverSideTranslations'
import { FormProvider, useForm } from 'react-hook-form'
import { useTranslation } from 'next-i18next'
import { useRouter } from 'next/router'
import { yupResolver } from '@hookform/resolvers/yup'
import * as yup from 'yup'
import { Heading, Box, Button, Text } from '@chakra-ui/react'

/**
 * The internal imports
 */
import AuthLayout from '/lib/layouts/auth'
import { OptimizedLink, Input } from '/components'
import { useResetPasswordMutation } from '/lib/services/modules/session'

export default function ForgotPassword() {
  const { t } = useTranslation('forgotPassword')
  const router = useRouter()
  const methods = useForm({
    resolver: yupResolver(
      yup.object({
        email: yup
          .string()
          .required(t('required', { ns: 'validations' }))
          .email(t('email', { ns: 'validations' })),
      })
    ),
    reValidateMode: 'onSubmit',
    defaultValues: {
      email: '',
    },
  })

  const [resetPassword, resetPasswordValues] = useResetPasswordMutation()

  useEffect(() => {
    if (resetPasswordValues.isSuccess) {
      router.push('/auth/sign-in?notifications=reset_password')
    }
  }, [resetPasswordValues.isSuccess])

  return (
    <React.Fragment>
      <Heading variant='h2' mb={14} textAlign='center'>
        {t('forgotPassword')}
      </Heading>
      <FormProvider {...methods}>
        <form onSubmit={methods.handleSubmit(resetPassword)}>
          <Input
            name='email'
            isRequired
            type='email'
            label={t('email')}
            autoFocus={true}
          />
          <Box mt={6} textAlign='center'>
            {resetPasswordValues.isError && (
              <Text fontSize='m' color='red' data-cy='server_message'>
                {typeof resetPasswordValues.error.error === 'string'
                  ? resetPasswordValues.error.error
                  : resetPasswordValues.error.data.errors.join()}
              </Text>
            )}
          </Box>
          <Button
            data-cy='submit'
            type='submit'
            w='full'
            mt={6}
            isLoading={resetPasswordValues.isLoading}
          >
            {t('send', { ns: 'common' })}
          </Button>
        </form>
      </FormProvider>
      <Box mt={8}>
        <OptimizedLink href='/auth/sign-in' fontSize='sm' data-cy='sign_in'>
          {t('signIn')}
        </OptimizedLink>
      </Box>
    </React.Fragment>
  )
}

export const getStaticProps = async ({ locale }) => ({
  props: {
    ...(await serverSideTranslations(locale, [
      'forgotPassword',
      'validations',
      'common',
    ])),
  },
})

ForgotPassword.getLayout = function getLayout(page) {
  return <AuthLayout namespace='forgotPassword'>{page}</AuthLayout>
}
