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
  Center,
  Text,
} from '@chakra-ui/react'
import { yupResolver } from '@hookform/resolvers/yup'
import * as yup from 'yup'
import { GetServerSidePropsContext } from 'next'
import { getServerSession } from 'next-auth'
import { QRCodeSVG } from 'qrcode.react'

/**
 * The internal imports
 */
import Layout from '@/lib/layouts/default'
import { Page, Input, FormError } from '@/components'
import { wrapper } from '@/lib/store'
import { useToast } from '@/lib/hooks'
import {
  getCredentials,
  useGetCredentialsQuery,
  useUpdatePasswordMutation,
} from '@/lib/services/modules/user'
import { authOptions } from '../api/auth/[...nextauth]'
import { apiRest } from '@/lib/services/apiRest'

/**
 * Type definitions
 */
type CredentialsProps = {
  userId: number
}

export default function Credentials({ userId }: CredentialsProps) {
  const { t } = useTranslation(['account', 'common'])
  const { newToast } = useToast()

  const [updatePassword, { isSuccess, isLoading, isError, error }] =
    useUpdatePasswordMutation()

  const { data } = useGetCredentialsQuery(userId)

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
          <Heading mb={10}>Set up 2FA</Heading>
          <Text>Please scan the code with an Authenticator</Text>
          <Center py={10}>
            {data && <QRCodeSVG value={data.otpProvisioningUri} size={200} />}
          </Center>
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
      if (typeof locale === 'string') {
        const currentUser = await getServerSession(req, res, authOptions)

        if (currentUser) {
          store.dispatch(getCredentials.initiate(currentUser.user.id))
          await Promise.all(
            store.dispatch(apiRest.util.getRunningQueriesThunk())
          )

          // Translations
          const translations = await serverSideTranslations(locale, [
            'common',
            'account',
            'submenu',
            'validations',
          ])

          return {
            props: {
              ...translations,
              userId: currentUser?.user.id,
            },
          }
        }
      }

      return {
        redirect: {
          destination: '/500',
          permanent: false,
        },
      }
    }
)
