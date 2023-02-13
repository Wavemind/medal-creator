/**
 * The external imports
 */
import React, { useEffect } from 'react'
import { serverSideTranslations } from 'next-i18next/serverSideTranslations'
import { FormProvider, useForm, SubmitHandler } from 'react-hook-form'
import { useTranslation } from 'next-i18next'
import { useRouter } from 'next/router'
import * as WebAuthnJSON from '@github/webauthn-json'
import { yupResolver } from '@hookform/resolvers/yup'
import * as yup from 'yup'
import { Heading, Box, Text, VStack, Button, useToast } from '@chakra-ui/react'
import { GetServerSideProps } from 'next'

/**
 * The internal imports
 */
import { useNewSessionMutation } from '@/lib/services/modules/session'
import AuthLayout from '@/lib/layouts/auth'
import { useAuthenticateMutation } from '@/lib/services/modules/webauthn'
import { apiGraphql } from '@/lib/services/apiGraphql'
import { apiRest } from '@/lib/services/apiRest'
import { useAppDispatch } from '@/lib/hooks'
import { OptimizedLink, Input } from '@/components'

/**
 * Types definition
 */
type SignInForm = {
  email: string
  password: string
}

export default function SignIn() {
  const { t } = useTranslation('signin')
  const dispatch = useAppDispatch()
  const router = useRouter()
  const {
    query: { from, notifications },
  } = router
  const toast = useToast()
  const methods = useForm<SignInForm>({
    resolver: yupResolver(
      yup.object({
        email: yup.string().label(t('email')).required().email(),
        password: yup.string().label(t('password')).required(),
      })
    ),
    reValidateMode: 'onSubmit',
    defaultValues: {
      email: '',
      password: '',
    },
  })

  const [newSession, newSessionValues] = useNewSessionMutation()
  const [authenticate, authenticateValues] = useAuthenticateMutation()

  useEffect(() => {
    if (notifications) {
      let title = ''
      let description = ''
      if (notifications === 'reset_password') {
        title = t('passwordReset', { ns: 'forgotPassword' })
        description = t('resetPasswordInstruction', { ns: 'forgotPassword' })
      } else {
        title = t('newPassword', { ns: 'newPassword' })
        description = t('newPasswordDescription', { ns: 'newPassword' })
      }
      toast({
        title,
        description,
        status: 'success',
        position: 'bottom-right',
      })
    }
  }, [notifications])

  /**
   * Step 1 - Trigger auth and clear cache
   * @param {email, password} values
   */
  const signIn: SubmitHandler<SignInForm> = async values => {
    dispatch(apiGraphql.util.resetApiState())
    dispatch(apiRest.util.resetApiState())
    newSession(values)
  }

  /**
   * Redirect user based on url
   */
  const redirect = () => {
    if (from) {
      router.push(from as string)
    } else if (newSessionValues.data.challenge) {
      router.push('/')
    } else {
      router.push('/account/credentials')
    }
  }

  /**
   * Step 2 - Normal auth or trigger 2FA
   */
  useEffect(() => {
    if (newSessionValues.isSuccess) {
      if (newSessionValues.data.challenge) {
        WebAuthnJSON.get({
          publicKey: newSessionValues.data,
        }).then(newCredentialInfo => {
          authenticate({
            credentials: newCredentialInfo,
            email: methods.getValues('email'),
          })
        })
      } else {
        redirect()
      }
    }
  }, [newSessionValues.isSuccess])

  /**
   * Step 3 (optional) - 2FA Auth
   */
  useEffect(() => {
    if (authenticateValues.isSuccess) {
      redirect()
    }
  }, [authenticateValues.isSuccess])

  return (
    <React.Fragment>
      <Heading variant='h2' mb={14} textAlign='center'>
        {t('login')}
      </Heading>
      <FormProvider {...methods}>
        <form onSubmit={methods.handleSubmit(signIn)}>
          <VStack align='left' spacing={6}>
            <Input name='email' type='email' isRequired label={t('email')} />
            <Input
              name='password'
              type='password'
              isRequired
              label={t('password')}
            />
          </VStack>
          <Box mt={6} textAlign='center'>
            {newSessionValues.isError && (
              <Text fontSize='m' color='red' data-cy='server_message'>
                {typeof newSessionValues.error.error === 'string'
                  ? newSessionValues.error.error
                  : newSessionValues.error.data.errors.join()}
              </Text>
            )}
          </Box>
          <Button
            data-cy='submit'
            type='submit'
            w='full'
            mt={6}
            isLoading={newSessionValues.isLoading}
          >
            {t('signIn')}
          </Button>
        </form>
      </FormProvider>
      <Box mt={8}>
        <OptimizedLink
          href='/auth/forgot-password'
          fontSize='sm'
          data-cy='forgot_password'
        >
          {t('forgotPassword')}
        </OptimizedLink>
      </Box>
    </React.Fragment>
  )
}

export const getServerSideProps: GetServerSideProps = async ({ locale }) => ({
  props: {
    ...(await serverSideTranslations(locale as string, [
      'signin',
      'validations',
      'forgotPassword',
      'newPassword',
      'common',
    ])),
  },
})

SignIn.getLayout = function getLayout(page: React.ReactElement) {
  return <AuthLayout namespace='signin'>{page}</AuthLayout>
}
