/**
 * The external imports
 */
import React, { FC } from 'react'
import { FormProvider, SubmitHandler, useForm } from 'react-hook-form'
import { useTranslation } from 'next-i18next'
import { yupResolver } from '@hookform/resolvers/yup'
import * as yup from 'yup'
import { Heading, Box, VStack, Button } from '@chakra-ui/react'
import { signIn, signOut } from "next-auth/react"
import { useRouter } from 'next/router'

/**
 * The internal imports
 */
import { OptimizedLink, Input } from '@/components'
import FormError from '@/components/formError'

/**
 * Type imports
 */
import type { SessionInputs } from '@/types/session'
import type { FetchBaseQueryError } from '@reduxjs/toolkit/dist/query'
import type { SerializedError } from '@reduxjs/toolkit'

type SignInFormProps = {
  isError: boolean
  error: FetchBaseQueryError | SerializedError | undefined
  isLoading: boolean
}

const SignIn: FC<SignInFormProps> = ({ isError, error, isLoading }) => {
  const { t } = useTranslation('signin')
  const router = useRouter()
  const {
    query: { from },
  } = router

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

  // Dispatches the signIn request to nextAuth
  const handleSignIn = (data: SessionInputs) => {
    let callbackUrl = '/'
    if (from) {
      callbackUrl = from
    }
    signIn('credentials', data, { callbackUrl })
  }

  return (
    <React.Fragment>
      <Heading variant='h2' mb={14} textAlign='center'>
        {t('login')}
      </Heading>
      <FormProvider {...methods}>
        <form onSubmit={methods.handleSubmit(handleSignIn)}>
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
            {isError && <FormError error={error} />}
          </Box>
          <Button
            data-cy='submit'
            type='submit'
            w='full'
            mt={6}
            isLoading={isLoading}
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

export default SignIn
