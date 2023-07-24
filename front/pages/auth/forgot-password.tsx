/**
 * The external imports
 */
import React, { ReactElement, useEffect } from 'react'
import { serverSideTranslations } from 'next-i18next/serverSideTranslations'
import { FormProvider, useForm } from 'react-hook-form'
import { useTranslation } from 'next-i18next'
import { useRouter } from 'next/router'
import { yupResolver } from '@hookform/resolvers/yup'
import * as yup from 'yup'
import { Heading, Box, Button } from '@chakra-ui/react'
import { Link } from '@chakra-ui/next-js'
import type { GetServerSideProps } from 'next'

/**
 * The internal imports
 */
import AuthLayout from '@/lib/layouts/auth'
import { Input, ErrorMessage } from '@/components'
import { useResetPasswordMutation } from '@/lib/api/modules'

export default function ForgotPassword() {
  const { t } = useTranslation('forgotPassword')
  const router = useRouter()
  const methods = useForm({
    resolver: yupResolver(
      yup.object({
        email: yup.string().label(t('email')).required().email(),
      })
    ),
    reValidateMode: 'onSubmit',
    defaultValues: {
      email: '',
    },
  })

  const [resetPassword, { isSuccess, isError, error, isLoading }] =
    useResetPasswordMutation()

  useEffect(() => {
    if (isSuccess) {
      router.push('/auth/sign-in?notifications=reset_password')
    }
  }, [isSuccess])

  return (
    <React.Fragment>
      <Heading variant='h2' mb={14} textAlign='center'>
        {t('forgotPassword')}
      </Heading>
      <FormProvider {...methods}>
        <form onSubmit={methods.handleSubmit(resetPassword)}>
          <Input name='email' isRequired type='email' label={t('email')} />
          <Box mt={6} textAlign='center'>
            {isError && <ErrorMessage error={error} />}
          </Box>
          <Button
            data-cy='submit'
            type='submit'
            w='full'
            mt={6}
            isLoading={isLoading}
          >
            {t('send', { ns: 'common' })}
          </Button>
        </form>
      </FormProvider>
      <Box mt={8}>
        <Link href='/auth/sign-in' fontSize='sm' data-cy='sign_in'>
          {t('signIn')}
        </Link>
      </Box>
    </React.Fragment>
  )
}

export const getStaticProps: GetServerSideProps = async ({ locale }) => ({
  props: {
    ...(await serverSideTranslations(locale as string, [
      'forgotPassword',
      'validations',
      'common',
    ])),
  },
})

ForgotPassword.getLayout = function getLayout(page: ReactElement) {
  return <AuthLayout namespace='forgotPassword'>{page}</AuthLayout>
}
