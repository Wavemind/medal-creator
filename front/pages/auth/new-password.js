/**
 * The external imports
 */
import { useEffect } from 'react'
import { serverSideTranslations } from 'next-i18next/serverSideTranslations'
import { useForm } from 'react-hook-form'
import { useTranslation } from 'next-i18next'
import Image from 'next/image'
import { useRouter } from 'next/router'
import {
  Heading,
  Flex,
  Box,
  Center,
  VStack,
  Button,
  FormControl,
  FormLabel,
  Input,
  FormErrorMessage,
} from '@chakra-ui/react'

/**
 * The internal imports
 */
import AuthLayout from '/lib/layouts/auth'
import { Page, OptimizedLink } from '/components'
import logo from '/public/logo.svg'
import { useNewPasswordMutation } from '/lib/services/modules/session'

export default function NewPassword() {
  const { t } = useTranslation(['newPassword', 'validations'])
  const router = useRouter()
  const {
    handleSubmit,
    register,
    formState: { errors },
  } = useForm()

  const [setNewPassword, newPasswordValues] = useNewPasswordMutation()

  const changePassword = values => {
    setNewPassword({ values, query: router.query })
  }

  useEffect(() => {
    if (newPasswordValues.isSuccess) {
      router.push('/auth/sign-in?notifications=new_password')
    }
  }, [newPasswordValues.isSuccess])

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
            ml={{ sm: 15, md: 0 }}
            mr={{ sm: 15, md: 0 }}
            mt={{ md: 150, lg: 20 }}
          >
            <Heading variant='h2' mb={14} textAlign='center'>
              {t('forgotPassword')}
            </Heading>
            <form onSubmit={handleSubmit(changePassword)}>
              <VStack align='left' spacing={6}>
                <FormControl
                  isInvalid={errors.password}
                  data-cy='from_control_password'
                >
                  <FormLabel>{t('password')}</FormLabel>
                  <Input
                    autoFocus={true}
                    type='password'
                    {...register('password', {
                      required: t('required', { ns: 'validations' }),
                    })}
                  />
                  <FormErrorMessage>
                    {errors.password && errors.password.message}
                  </FormErrorMessage>
                </FormControl>
                <FormControl
                  isInvalid={errors.passwordConfirmation}
                  data-cy='from_control_password_confirmation'
                >
                  <FormLabel>{t('passwordConfirmation')}</FormLabel>
                  <Input
                    type='password'
                    {...register('passwordConfirmation', {
                      required: t('required', { ns: 'validations' }),
                    })}
                  />
                  <FormErrorMessage>
                    {errors.passwordConfirmation &&
                      errors.passwordConfirmation.message}
                  </FormErrorMessage>
                </FormControl>
              </VStack>
              <Box mt={6} textAlign='center'>
                {newPasswordValues.isError && (
                  <Text fontSize='m' color='red' data-cy='server_message'>
                    {typeof newPasswordValues.error.error === 'string'
                      ? newPasswordValues.error.error
                      : newPasswordValues.error.data.errors.join()}
                  </Text>
                )}
              </Box>
              <Button
                data-cy='submit'
                type='submit'
                w='full'
                mt={6}
                isLoading={newPasswordValues.isLoading}
              >
                {t('save', { ns: 'common' })}
              </Button>
            </form>
            <Box mt={8}>
              <OptimizedLink href='/auth/sign-in' fontSize='sm'>
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
              <VStack>
                <Image
                  src={logo}
                  alt={t('logoDescription')}
                  width={400}
                  height={400}
                />
              </VStack>
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
      'newPassword',
      'validations',
      'common',
    ])),
  },
})

NewPassword.getLayout = function getLayout(page) {
  return <AuthLayout>{page}</AuthLayout>
}
