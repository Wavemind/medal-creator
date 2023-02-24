/**
 * The external imports
 */
import React, { useEffect, useState } from 'react'
import { GetServerSideProps } from 'next'
import { serverSideTranslations } from 'next-i18next/serverSideTranslations'
import { FormProvider, useForm, SubmitHandler } from 'react-hook-form'
import { useTranslation } from 'next-i18next'
import { useRouter } from 'next/router'
import { yupResolver } from '@hookform/resolvers/yup'
import * as yup from 'yup'
import { Heading, Box, VStack, Button, useToast, HStack } from '@chakra-ui/react'

/**
 * The internal imports
 */
import { useNewSessionMutation } from '@/lib/services/modules/session'
import AuthLayout from '@/lib/layouts/auth'
import { apiGraphql } from '@/lib/services/apiGraphql'
import { apiRest } from '@/lib/services/apiRest'
import { useAppDispatch } from '@/lib/hooks'
import { OptimizedLink, Input, Pin, SignInForm } from '@/components'
import FormError from '@/components/formError'

/**
 * Type imports
 */
import type { SessionInputs } from '@/types/session'

export default function SignIn() {
  const { t } = useTranslation('signin')
  const dispatch = useAppDispatch()
  const router = useRouter()
  const {
    query: { from, notifications },
  } = router
  const toast = useToast()
  const methods = useForm<SessionInputs>({
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

  const [twoFa, setTwoFa] = useState(false)

  /**
   * Prefetch route to improve rapidy after a successful login
   */
  useEffect(() => {
    router.prefetch('/')
    router.prefetch('/account/credentials')
  }, [])

  const [newSession, { data: session, isSuccess, isError, error, isLoading }] =
    useNewSessionMutation()

  useEffect(() => {
    if (notifications) {
      let title = ''
      let description = ''

      let status: 'success' | 'error' | 'warning' | 'info' | undefined =
        'success'
      switch (notifications) {
        case 'reset_password':
          title = t('passwordReset', { ns: 'forgotPassword' })
          description = t('resetPasswordInstruction', { ns: 'forgotPassword' })
          break
        case 'new_password':
          title = t('newPassword', { ns: 'newPassword' })
          description = t('newPasswordDescription', { ns: 'newPassword' })
          break
        case 'inactivity':
          title = t('notifications.inactivity', { ns: 'common' })
          status = 'warning'
          break
        default:
          break
      }

      toast({
        title,
        description,
        status,
        position: 'bottom-right',
      })
    }
  }, [notifications])

  /**
   * Step 1 - Trigger auth and clear cache
   * @param {email, password} values
   */
  const signIn: SubmitHandler<SessionInputs> = async values => {
    dispatch(apiGraphql.util.resetApiState())
    dispatch(apiRest.util.resetApiState())
    newSession(values)
  }

  const onComplete = (value: string) => {
    console.log(value)
  }

  /**
   * Redirect user based on url
   */
  const redirect = () => {
    if (from) {
      router.push(from as string)
    } else if (session?.challenge) {
      router.push('/')
    } else {
      router.push('/account/credentials')
    }
  }

  /**
   * Step 2 - Normal auth or trigger 2FA
   */
  useEffect(() => {
    if (isSuccess) {
      // if (session?.challenge) {
      //   // TODO WAIT FOR NEW 2FA
      // } else {
      //   redirect()
      // }
      setTwoFa(true)
    }
  }, [isSuccess])

  return twoFa ? (
    <React.Fragment>
      <Heading variant='h2' mb={14} textAlign='center'>
        Two Factor Authentication
      </Heading>
      <Pin name='twoFa' label='Pin' onComplete={onComplete} />
    </React.Fragment>
  ) : (
    <SignInForm
      signIn={signIn}
      isError={isError}
      error={error}
      isLoading={isLoading}
    />
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
