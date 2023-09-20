/**
 * The external imports
 */
import React, { useEffect, useState } from 'react'
import { FormProvider, useForm } from 'react-hook-form'
import { serverSideTranslations } from 'next-i18next/serverSideTranslations'
import { yupResolver } from '@hookform/resolvers/yup'
import * as yup from 'yup'
import { useTranslation } from 'next-i18next'
import {
  HStack,
  Heading,
  Box,
  VStack,
  Button,
  AlertStatus,
  Spinner,
  Center,
} from '@chakra-ui/react'
import { signIn } from 'next-auth/react'
import { AnimatePresence, motion } from 'framer-motion'
import { Link } from '@chakra-ui/next-js'
import type { GetServerSideProps } from 'next'

/**
 * The internal imports
 */
import AuthLayout from '@/lib/layouts/auth'
import { apiGraphql } from '@/lib/api/apiGraphql'
import { apiRest } from '@/lib/api/apiRest'
import { useAppDispatch, useAppRouter, useToast } from '@/lib/hooks'
import ErrorMessage from '@/components/errorMessage'
import Input from '@/components/inputs/input'
import Pin from '@/components/inputs/pin'

/**
 * Type imports
 */
import type { SessionInputs } from '@/types'

export default function SignIn() {
  const { t } = useTranslation('signin')
  const dispatch = useAppDispatch()
  const router = useAppRouter()
  const {
    query: { callbackUrl, notifications },
  } = router
  const { newToast } = useToast()

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
  const [isLoading, setLoading] = useState(false)
  const [credentialsError, setCredentialsError] = useState('')
  const [otpError, setOtpError] = useState('')

  console.log('rendering the shit')

  useEffect(() => {
    if (notifications) {
      console.log('in here', notifications)
      let description = ''

      let status: AlertStatus = 'success'
      switch (notifications) {
        case 'reset_password':
          description = t('resetPasswordInstruction', { ns: 'forgotPassword' })
          break
        case 'new_password':
          description = t('newPasswordDescription', { ns: 'newPassword' })
          break
        case 'inactivity':
          description = t('notifications.inactivity', { ns: 'common' })
          status = 'warning'
          break
        case 'session-expired':
          description = t('notifications.sessionExpired', { ns: 'common' })
          status = 'info'
          break
        default:
          break
      }

      newToast({
        message: description,
        status,
      })
    }
  }, [notifications])

  /**
   * Returns to the sign-in component and clears credential errors
   */
  const returnToSignIn = () => {
    setCredentialsError('')
    setOtpError('')
    setTwoFa(false)
  }

  /**
   * Called when pin entry has completed.
   * Sends a request to the api to verify validity of the pin
   * @param value
   */
  const onComplete = async (value: string) => {
    setLoading(true)
    const formValues = methods.getValues()

    let redirectUrl = '/'
    if (callbackUrl) {
      redirectUrl = callbackUrl
    }

    const result = await signIn('credentials', {
      ...formValues,
      otp_attempt: value,
      redirect: false,
    })

    if (result?.ok) {
      dispatch(apiGraphql.util.resetApiState())
      dispatch(apiRest.util.resetApiState())
      router.push(redirectUrl)
    } else if (result?.error) {
      const response = JSON.parse(result.error)

      if (response.errors[0].length) {
        setOtpError(response.errors[0])
      }
    }

    setLoading(false)
  }

  /**
   * Initial sign in call to the api. Checks whether 2FA is required or not
   * @param data SessionInputs
   */
  const handleSignIn = async (data: SessionInputs) => {
    setLoading(true)
    setCredentialsError('')

    const result = await signIn('credentials', {
      ...data,
      redirect: false,
    })

    if (result && result.error) {
      try {
        const response = JSON.parse(result.error)

        setLoading(false)
        if (response.errors[0].length) {
          setCredentialsError(response.errors[0])
        }

        if (response.need_otp) {
          setTwoFa(true)
        }
      } catch {
        setLoading(false)
        setCredentialsError(t('errorBoundary.generalError', { ns: 'common' }))
      }
    } else {
      let redirectUrl = '/'
      if (callbackUrl) {
        redirectUrl = callbackUrl
      }

      dispatch(apiGraphql.util.resetApiState())
      dispatch(apiRest.util.resetApiState())
      router.push(redirectUrl)
    }
  }

  return (
    <AnimatePresence mode='wait'>
      {twoFa ? (
        <motion.div
          key='pin'
          initial={{ opacity: 0 }}
          animate={{ opacity: 1, transition: { duration: 0.3 } }}
          exit={{ opacity: 0, transition: { duration: 0.3 } }}
        >
          <Heading variant='h2' mb={14} textAlign='center'>
            {t('2fa')}
          </Heading>
          <Pin onComplete={onComplete} />
          <Center h={50}>
            {isLoading && <Spinner />}
            {!isLoading && otpError.length > 0 && (
              <ErrorMessage error={otpError} />
            )}
          </Center>
          <HStack justifyContent='center'>
            <Button variant='ghost' onClick={returnToSignIn}>
              {t('cancel', { ns: 'common' })}
            </Button>
          </HStack>
        </motion.div>
      ) : (
        <motion.div
          key='form'
          initial={{ opacity: 0 }}
          animate={{ opacity: 1, transition: { duration: 0.3 } }}
          exit={{ opacity: 0, transition: { duration: 0.3 } }}
        >
          <React.Fragment>
            <Heading variant='h2' mb={14} textAlign='center'>
              {t('login')}
            </Heading>
            <FormProvider {...methods}>
              <form onSubmit={methods.handleSubmit(handleSignIn)}>
                <VStack align='left' spacing={6}>
                  <Input
                    name='email'
                    type='email'
                    isRequired
                    label={t('email')}
                  />
                  <Input
                    name='password'
                    type='password'
                    isRequired
                    label={t('password')}
                  />
                </VStack>
                <Box mt={6} textAlign='center'>
                  {credentialsError.length > 0 && (
                    <ErrorMessage error={credentialsError} />
                  )}
                </Box>
                <Button type='submit' w='full' mt={6} isLoading={isLoading}>
                  {t('signIn')}
                </Button>
              </form>
            </FormProvider>
            <Box mt={8}>
              <Link href='/auth/forgot-password' fontSize='sm'>
                {t('forgotPassword')}
              </Link>
            </Box>
          </React.Fragment>
        </motion.div>
      )}
    </AnimatePresence>
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
