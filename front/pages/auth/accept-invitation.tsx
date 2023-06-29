/**
 * The external imports
 */
import React, { useEffect, ReactElement } from 'react'
import { GetServerSideProps } from 'next'
import { serverSideTranslations } from 'next-i18next/serverSideTranslations'
import { useForm } from 'react-hook-form'
import { useTranslation } from 'next-i18next'
import { yupResolver } from '@hookform/resolvers/yup'
import * as yup from 'yup'
import { Heading, Box, VStack, Button } from '@chakra-ui/react'

/**
 * The internal imports
 */
import { useAcceptInvitationMutation } from '@/lib/api/modules'
import AuthLayout from '@/lib/layouts/auth'
import { FormProvider, Input, ErrorMessage } from '@/components'
import { useAppRouter, useToast } from '@/lib/hooks'
import type { AcceptInvitationMutationVariables } from '@/lib/api/modules/generated/user.generated'

export default function AcceptInvitation() {
  const { t } = useTranslation('acceptInvitation')
  const router = useAppRouter()
  const { newToast } = useToast()
  const methods = useForm<AcceptInvitationMutationVariables>({
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
      invitationToken: router.query.invitation_token,
    },
  })

  const [acceptInvitation, { isSuccess, isError, error, isLoading }] =
    useAcceptInvitationMutation()

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
      <FormProvider<AcceptInvitationMutationVariables>
        methods={methods}
        isError={isError}
        error={error}
      >
        <form onSubmit={methods.handleSubmit(acceptInvitation)}>
          <VStack align='left' spacing={6}>
            <Input
              name='password'
              label={t('password')}
              type='password'
              helperText={t('passwordHint')}
              isRequired
            />
            <Input
              name='passwordConfirmation'
              label={t('passwordConfirmation')}
              type='password'
              helperText={t('passwordHint')}
              isRequired
            />
          </VStack>
          <Box mt={6} textAlign='center'>
            {isError && <ErrorMessage error={error} />}
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

export const getServerSideProps: GetServerSideProps = async ({ locale }) => ({
  props: {
    ...(await serverSideTranslations(locale as string, [
      'acceptInvitation',
      'validations',
      'common',
    ])),
  },
})

AcceptInvitation.getLayout = function getLayout(page: ReactElement) {
  return <AuthLayout namespace='acceptInvitation'>{page}</AuthLayout>
}
