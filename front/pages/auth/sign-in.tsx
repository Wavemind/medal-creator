/**
 * The external imports
 */
import React, { useEffect, useState } from 'react'
import { FormProvider, useForm } from 'react-hook-form'
import { GetServerSideProps } from 'next'
import { serverSideTranslations } from 'next-i18next/serverSideTranslations'
import { yupResolver } from '@hookform/resolvers/yup'
import * as yup from 'yup'
import { useTranslation } from 'next-i18next'
import { useRouter } from 'next/router'
import {
  HStack,
  useToast,
  Heading,
  Box,
  VStack,
  Button,
} from '@chakra-ui/react'
import { signIn } from 'next-auth/react'

/**
 * The internal imports
 */
import AuthLayout from '@/lib/layouts/auth'
import { apiGraphql } from '@/lib/services/apiGraphql'
import { apiRest } from '@/lib/services/apiRest'
import { useAppDispatch } from '@/lib/hooks'
import { FormError, Input, OptimizedLink, Pin } from '@/components'

/**
 * Type imports
 */
import type { SessionInputs } from '@/types/session'
import { AnimatePresence, motion } from 'framer-motion'

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
      email: 'dev-admin@wavemind.ch',
      password: 'P@ssw0rd',
    },
  })

  const [twoFa, setTwoFa] = useState(false)
  const [credentialsError, setCredentialsError] = useState('')
  const [otpError, setOtpError] = useState('')

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
    const formValues = methods.getValues()

    let callbackUrl = '/'
    if (typeof from === 'string') {
      callbackUrl = from
    }

    const result = await signIn('credentials', {
      ...formValues,
      otp_attempt: value,
      redirect: false,
      callbackUrl,
    })

    if (result) {
      if (result.ok) {
        dispatch(apiGraphql.util.resetApiState())
        dispatch(apiRest.util.resetApiState())
        router.push(callbackUrl)
      } else {
        if (result.error) {
          const response = JSON.parse(result.error)

          if (response.errors[0].length) {
            setOtpError(response.errors[0])
          }
        }
      }
    }
  }

  /**
   * Initial sign in call to the api. Checks whether 2FA is required or not
   * @param data SessionInputs
   */
  const handleSignIn = async (data: SessionInputs) => {
    setCredentialsError('')

    let callbackUrl = '/'
    if (typeof from === 'string') {
      callbackUrl = from
    }
    const result = await signIn('credentials', {
      ...data,
      redirect: false,
      callbackUrl,
    })

    if (result && result.error) {
      const response = JSON.parse(result.error)

      if (response.errors[0].length) {
        setCredentialsError(response.errors[0])
      }

      if (response.need_otp) {
        setTwoFa(true)
      }
    } else {
      dispatch(apiGraphql.util.resetApiState())
      dispatch(apiRest.util.resetApiState())
      router.push(callbackUrl)
    }
  }

  return (
    <AnimatePresence mode='wait'>
      {twoFa ? (
        <motion.div
          key='pin'
          initial={{ opacity: 0 }}
          animate={{ opacity: 1, transition: { duration: 0.5 } }}
          exit={{ opacity: 0, transition: { duration: 0.5 } }}
        >
          <Heading variant='h2' mb={14} textAlign='center'>
            {t('2fa')}
          </Heading>
          <Pin name='twoFa' label={t('enterCode')} onComplete={onComplete} />
          <Box my={4} textAlign='center'>
            {otpError.length > 0 && <FormError error={otpError} />}
          </Box>
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
          animate={{ opacity: 1, transition: { duration: 0.5 } }}
          exit={{ opacity: 0, transition: { duration: 0.5 } }}
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
                    <FormError error={credentialsError} />
                  )}
                </Box>
                <Button data-cy='submit' type='submit' w='full' mt={6}>
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
