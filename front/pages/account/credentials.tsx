/**
 * The external imports
 */
import { ReactElement, useEffect } from 'react'
import { useForm, FormProvider } from 'react-hook-form'
import { serverSideTranslations } from 'next-i18next/serverSideTranslations'
import { useTranslation } from 'next-i18next'
import {
  VStack,
  Button,
  Box,
  Heading,
  HStack,
  SimpleGrid,
} from '@chakra-ui/react'
import { yupResolver } from '@hookform/resolvers/yup'
import * as yup from 'yup'
import {
  GetServerSidePropsContext,
  NextApiRequest,
  NextApiResponse,
} from 'next'

/**
 * The internal imports
 */
import Layout from '@/lib/layouts/default'
import { TwoFactorAuth, Page, Input, FormError } from '@/components'
import { getCredentials } from '@/lib/services/modules/webauthn'
import { apiRest } from '@/lib/services/apiRest'
import { wrapper } from '@/lib/store'
import { setSession } from '@/lib/store/session'
import { useToast } from '@/lib/hooks'
import { useUpdatePasswordMutation } from '@/lib/services/modules/user'
import getUserBySession from '@/lib/utils/getUserBySession'

/**
 * Type definitions
 */
type CredentialsProps = {
  userId: string
}

export default function Credentials({ userId }: CredentialsProps) {
  const { t } = useTranslation(['account', 'common'])
  const { newToast } = useToast()

  const [updatePassword, { isSuccess, isLoading, isError, error }] =
    useUpdatePasswordMutation()

  /**
   * Setup form configuration
   */
  const methods = useForm({
    resolver: yupResolver(
      yup.object({
        password: yup.string().label(t('credentials.password')).required(),
        passwordConfirmation: yup
          .string()
          .label(t('credentials.passwordConfirmation'))
          .required(),
      })
    ),
    reValidateMode: 'onSubmit',
    defaultValues: { id: userId, password: '', passwordConfirmation: '' },
  })

  useEffect(() => {
    if (isSuccess) {
      newToast({
        message: t('notifications.updateSuccess', { ns: 'common' }),
        status: 'success',
      })
    }
  }, [isSuccess])

  return (
    <Page title={t('credentials.title')}>
      <SimpleGrid columns={2} spacing={10}>
        <Box>
          <Heading mb={10}>{t('credentials.header')}</Heading>
          <FormProvider {...methods}>
            <form onSubmit={methods.handleSubmit(updatePassword)}>
              <VStack align='left' spacing={12}>
                <Input
                  label={t('credentials.password')}
                  name='password'
                  type='password'
                  isRequired
                />
                <Input
                  label={t('credentials.passwordConfirmation')}
                  name='passwordConfirmation'
                  type='password'
                  isRequired
                />

                <Box mt={6} textAlign='center'>
                  {isError && <FormError error={error} />}
                </Box>
                <HStack justifyContent='flex-end'>
                  <Button type='submit' mt={6} isLoading={isLoading}>
                    {t('save', { ns: 'common' })}
                  </Button>
                </HStack>
              </VStack>
            </form>
          </FormProvider>
        </Box>
        <Box>
          <TwoFactorAuth />
        </Box>
      </SimpleGrid>
    </Page>
  )
}

Credentials.getLayout = function getLayout(page: ReactElement) {
  return (
    <Layout menuType='account' showSideBar={false}>
      {page}
    </Layout>
  )
}

export const getServerSideProps = wrapper.getServerSideProps(
  store =>
    async ({ locale, req, res }: GetServerSidePropsContext) => {
      const currentUser = getUserBySession(
        req as NextApiRequest,
        res as NextApiResponse
      )
      await store.dispatch(setSession(currentUser))
      // TODO : Remove this when new 2FA
      store.dispatch(getCredentials.initiate())
      await Promise.all(store.dispatch(apiRest.util.getRunningQueriesThunk()))

      // Translations
      const translations = await serverSideTranslations(locale as string, [
        'common',
        'account',
        'submenu',
        'validations',
      ])

      return {
        props: {
          ...translations,
          userId: currentUser.userId,
        },
      }
    }
)
