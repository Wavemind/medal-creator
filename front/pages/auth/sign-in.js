/**
 * The external imports
 */
import React, { useEffect } from 'react'
import Image from 'next/image'
import { serverSideTranslations } from 'next-i18next/serverSideTranslations'
import { useForm } from 'react-hook-form'
import { useTranslation } from 'next-i18next'
import { useRouter } from 'next/router'
import * as WebAuthnJSON from '@github/webauthn-json'
import {
  Heading,
  Flex,
  Box,
  Center,
  Text,
  VStack,
  Button,
  FormControl,
  FormLabel,
  Input,
  FormErrorMessage,
  useToast,
} from '@chakra-ui/react'

/**
 * The internal imports
 */
import { useNewSessionMutation } from '/lib/services/modules/session'
import logo from '/public/logo.svg'
import AuthLayout from '/lib/layouts/auth'
import { useAuthenticateMutation } from '/lib/services/modules/webauthn'
import { Page, OptimizedLink } from '/components'

export default function SignIn() {
  const { t } = useTranslation('signin')
  const router = useRouter()
  const toast = useToast()
  const {
    getValues,
    handleSubmit,
    register,
    formState: { errors },
  } = useForm()

  const [newSession, newSessionValues] = useNewSessionMutation()
  const [authenticate, authenticateValues] = useAuthenticateMutation()

  useEffect(() => {
    if (router.query.notifications) {
      let title = ''
      let description = ''
      if (router.query.notifications === 'reset_password') {
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
  }, [router.query.notifications])

  // Step 1 - Trigger auth
  const signIn = values => {
    newSession(values)
  }

  /**
   * Redirect user based on url
   */
  const redirect = () => {
    if (router.query.from) {
      router.push(router.query.from)
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
            email: getValues('email'),
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
    <Page title={t('title')}>
      <Flex
        h={{ sm: 'initial', md: '75vh', lg: '100vh' }}
        w='100%'
        maxW='1044px'
        mx='auto'
        justifyContent='space-between'
        pt={{ sm: 150, md: 0 }}
      >
        <Flex
          alignItems='center'
          justifyContent='start'
          w={{ base: '100%', md: '50%', lg: '42%' }}
        >
          <Flex
            direction='column'
            w='100%'
            boxShadow='0px 0px 4px rgba(0, 0, 0, 0.25)'
            borderRadius='2xl'
            background='transparent'
            p={{ sm: 10 }}
            mx={{ sm: 15, md: 0 }}
            mt={{ md: 150, lg: 20 }}
          >
            <Heading variant='h2' mb={14} textAlign='center'>
              {t('login')}
            </Heading>
            <form onSubmit={handleSubmit(signIn)}>
              <VStack align='left' spacing={6}>
                <FormControl
                  isInvalid={errors.email}
                  data-cy='from_control_email'
                >
                  <FormLabel>{t('email')}</FormLabel>
                  <Input
                    autoFocus={true}
                    {...register('email', {
                      required: t('required', { ns: 'validations' }),
                    })}
                  />
                  <FormErrorMessage>
                    {errors.email && errors.email.message}
                  </FormErrorMessage>
                </FormControl>
                <FormControl
                  isInvalid={errors.password}
                  data-cy='from_control_password'
                >
                  <FormLabel>{t('password')}</FormLabel>
                  <Input
                    type='password'
                    {...register('password', {
                      required: t('required', { ns: 'validations' }),
                    })}
                  />
                  <FormErrorMessage>
                    {errors.password && errors.password.message}
                  </FormErrorMessage>
                </FormControl>
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
            <Box mt={8}>
              <OptimizedLink
                href='/auth/forgot-password'
                fontSize='sm'
                data-cy='forgot_password'
              >
                {t('forgotPassword')}
              </OptimizedLink>
            </Box>
          </Flex>
        </Flex>
        <Box
          display={{ base: 'none', md: 'block' }}
          h='100vh'
          w='40vw'
          position='absolute'
          right={0}
        >
          <Box
            bgGradient='linear(primary, blue.700)'
            w='100%'
            h='100%'
            bgPosition='50%'
          >
            <Center h='50%'>
              <Image
                src={logo}
                alt={t('medalCreator', { ns: 'common' })}
                width={400}
                height={400}
              />
            </Center>
          </Box>
        </Box>
      </Flex>
    </Page>
  )
}

export const getStaticProps = async ({ locale }) => ({
  props: {
    ...(await serverSideTranslations(locale, [
      'signin',
      'validations',
      'forgotPassword',
      'newPassword',
      'common',
    ])),
  },
})

SignIn.getLayout = function getLayout(page) {
  return <AuthLayout>{page}</AuthLayout>
}
