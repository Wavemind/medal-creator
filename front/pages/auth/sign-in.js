/**
 * The external imports
 */
import React, { useEffect } from 'react'
import { serverSideTranslations } from 'next-i18next/serverSideTranslations'
import { useForm } from 'react-hook-form'
import {
  Heading,
  Link,
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
} from '@chakra-ui/react'
import Image from 'next/image'
import { useTranslation } from 'next-i18next'
import { useRouter } from 'next/router'

/**
 * The internal imports
 */
import { useNewSessionMutation } from '/lib/services/modules/auth'
import logo from '/public/logo.svg'
import AuthLayout from '/lib/layouts/auth'

export default function SignIn() {
  const router = useRouter()
  const { t } = useTranslation(['signin', 'validations'])
  const {
    handleSubmit,
    register,
    formState: { errors },
  } = useForm()

  const [newSession, newSessionValues] = useNewSessionMutation()

  const signIn = values => {
    newSession(values)
  }

  useEffect(() => {
    if (newSessionValues.isSuccess) {
      console.log(newSessionValues.data)
      if (newSessionValues.data.challenge) {
        // TODO
      } else {
        if (router.query.from) {
          router.push(router.query.from)
        } else {
          router.push('/account/credentials')
        }
      }
    }
  }, [newSessionValues.isSuccess])

  return (
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
                  {newSessionValues.error.data.errors.join()}
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
            <Link fontSize='sm' data-cy='forgot_password'>
              {t('forgotPassword')}
            </Link>
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
  )
}

export const getStaticProps = async ({ locale }) => ({
  props: {
    ...(await serverSideTranslations(locale, ['signin', 'validations'])),
  },
})

SignIn.getLayout = function getLayout(page) {
  return <AuthLayout>{page}</AuthLayout>
}
