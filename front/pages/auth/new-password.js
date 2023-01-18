/**
 * The external imports
 */
import React, { useEffect } from 'react'
import { serverSideTranslations } from 'next-i18next/serverSideTranslations'
import { FormProvider, useForm } from 'react-hook-form'
import { useTranslation } from 'next-i18next'
import { useRouter } from 'next/router'
import { yupResolver } from '@hookform/resolvers/yup'
import * as yup from 'yup'
import { Heading, Box, VStack, Button, Text } from '@chakra-ui/react'

/**
 * The internal imports
 */
import AuthLayout from '/lib/layouts/auth'
import { OptimizedLink, Input } from '/components'
import { useNewPasswordMutation } from '/lib/services/modules/session'

export default function NewPassword() {
  const { t } = useTranslation('newPassword')
  const router = useRouter()
  const methods = useForm({
    resolver: yupResolver(
      yup.object({
        password: yup.string().required(t('required', { ns: 'validations' })),
        passwordConfirmation: yup
          .string()
          .required(t('required', { ns: 'validations' })),
      })
    ),
    reValidateMode: 'onSubmit',
    defaultValues: {
      password: '',
      passwordConfirmation: '',
    },
  })

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
    <React.Fragment>
      <Heading variant='h2' mb={14} textAlign='center'>
        {t('forgotPassword')}
      </Heading>
      <FormProvider {...methods}>
        <form onSubmit={methods.handleSubmit(changePassword)}>
          <VStack align='left' spacing={6}>
            <Input
              type='password'
              label={t('password')}
              name='password'
              isRequired
            />
            <Input
              type='password'
              label={t('passwordConfirmation')}
              name='passwordConfirmation'
              isRequired
            />
          </VStack>
          <Box mt={6} textAlign='center'>
            {newPasswordValues.isError && (
              <Text fontSize='m' color='red' data-cy='server_message'>
                {typeof newPasswordValues.error.error === 'string'
                  ? newPasswordValues.error.error
                  : newPasswordValues.error.data.errors.full_messages.join()}
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
      </FormProvider>
      <Box mt={8}>
        <OptimizedLink href='/auth/sign-in' fontSize='sm' data-cy='sign_in'>
          {t('signIn')}
        </OptimizedLink>
      </Box>
    </React.Fragment>
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
  return <AuthLayout namespace='newPassword'>{page}</AuthLayout>
}
