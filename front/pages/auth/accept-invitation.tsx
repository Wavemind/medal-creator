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
import { Heading, Box, Text, VStack, Button } from '@chakra-ui/react'

/**
 * The internal imports
 */
import { useAcceptInvitationMutation } from '@/lib/services/modules/user'
import AuthLayout from '@/lib/layouts/auth'
import { Input } from '@/components'
import { useToast } from '@/lib/hooks'

export default function AcceptInvitation() {
  const { t } = useTranslation('acceptInvitation')
  const router = useRouter()
  const { newToast } = useToast()
  const methods = useForm({
    resolver: yupResolver(
      yup.object({
        password: yup.string().label(t('password')).required(),
        passwordConfirmation: yup.string().label(t('password')).required(),
      })
    ),
    reValidateMode: 'onSubmit',
    defaultValues: {
      password: '',
      passwordConfirmation: '',
    },
  })

  const [acceptInvitation, { isSuccess, isError, error, isLoading }] =
    useAcceptInvitationMutation()

  // Trigger invitation accept
  const accept = async values => {
    acceptInvitation({
      ...values,
      invitationToken: router.query.invitation_token,
    })
  }

  /**
   * If successful, redirect to the sign in page
   */
  useEffect(() => {
    if (isSuccess) {
      newToast({
        message: t('notifications.createSuccess', { ns: 'common' }),
        status: 'success',
      })
      router.push('/auth/sign-in')
    }
  }, [isSuccess])

  return (
    <React.Fragment>
      <Heading variant='h2' mb={14} textAlign='center'>
        {t('acceptInvitation')}
      </Heading>
      <FormProvider {...methods}>
        <form onSubmit={methods.handleSubmit(accept)}>
          <VStack align='left' spacing={6}>
            <Input
              type='password'
              label={t('password')}
              name='password'
              helperText={t('passwordHint')}
              isRequired
            />
            <Input
              type='password'
              label={t('passwordConfirmation')}
              name='passwordConfirmation'
              helperText={t('passwordHint')}
              isRequired
            />
          </VStack>
          <Box mt={6} textAlign='center'>
            {isError && (
              <Text fontSize='m' color='red' data-cy='server_message'>
                {typeof error.message === 'string'
                  ? error.message.split(':')[0]
                  : error.data.errors.join()}
              </Text>
            )}
          </Box>
          <Button
            data-cy='submit'
            type='submit'
            w='full'
            mt={6}
            isLoading={isLoading}
          >
            {t('accept')}
          </Button>
        </form>
      </FormProvider>
    </React.Fragment>
  )
}

export const getServerSideProps = async ({ locale }) => ({
  props: {
    ...(await serverSideTranslations(locale, [
      'acceptInvitation',
      'validations',
      'common',
    ])),
  },
})

AcceptInvitation.getLayout = function getLayout(page) {
  return <AuthLayout namespace='acceptInvitation'>{page}</AuthLayout>
}
