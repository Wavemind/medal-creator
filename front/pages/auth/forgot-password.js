/**
 * The external imports
 */
import { useEffect } from 'react'
import { serverSideTranslations } from 'next-i18next/serverSideTranslations'
import { useForm } from 'react-hook-form'
import { useTranslation } from 'next-i18next'
import { useRouter } from 'next/router'
import Image from 'next/image'
import {
  Heading,
  Flex,
  Box,
  Center,
  Button,
  FormControl,
  FormLabel,
  Input,
  FormErrorMessage,
  Text,
} from '@chakra-ui/react'

/**
 * The internal imports
 */
import AuthLayout from '/lib/layouts/auth'
import { Page, OptimizedLink } from '/components'
import logo from '/public/logo.svg'
import { useResetPasswordMutation } from '/lib/services/modules/session'

export default function ForgotPassword() {
  const { t } = useTranslation('forgotPassword')
  const router = useRouter()
  const {
    handleSubmit,
    register,
    formState: { errors },
  } = useForm()

  const [resetPassword, resetPasswordValues] = useResetPasswordMutation()

  useEffect(() => {
    if (resetPasswordValues.isSuccess) {
      router.push('/auth/sign-in?notifications=reset_password')
    }
  }, [resetPasswordValues.isSuccess])

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
              {t('forgotPassword')}
            </Heading>
            <form onSubmit={handleSubmit(resetPassword)}>
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
            <Box mt={8}>
              <OptimizedLink
                href='/auth/sign-in'
                fontSize='sm'
                data-cy='sign_in'
              >
                {t('signIn')}
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
      'forgotPassword',
      'validations',
      'common',
    ])),
  },
})

ForgotPassword.getLayout = function getLayout(page) {
  return <AuthLayout>{page}</AuthLayout>
}
