/**
 * The external imports
 */
import { ReactElement } from 'react'
import { serverSideTranslations } from 'next-i18next/serverSideTranslations'
import { useTranslation } from 'next-i18next'
import { Box, Heading, SimpleGrid } from '@chakra-ui/react'
import { getServerSession } from 'next-auth'
import type { GetServerSidePropsContext } from 'next'

/**
 * The internal imports
 */
import Layout from '@/lib/layouts/default'
import Page from '@/components/page'
import ChangePasswordForm from '@/components/forms/changePassword'
import TwoFactor from '@/components/twoFactor'
import { wrapper } from '@/lib/store'
import { authOptions } from '@/pages/api/auth/[...nextauth]'
import { apiGraphql } from '@/lib/api/apiGraphql'
import {
  getOtpRequiredForLogin,
  getQrCodeUri,
} from '@/lib/api/modules/enhanced/twoFactor.enhanced'
import type { UserId } from '@/types'

export default function Credentials({ userId }: UserId) {
  const { t } = useTranslation('account')

  return (
    <Page title={t('credentials.title')}>
      <SimpleGrid columns={2} spacing={10}>
        <Box>
          <Heading mb={10}>{t('credentials.header')}</Heading>
          <ChangePasswordForm userId={userId} />
        </Box>
        <Box>
          <Heading mb={10}>{t('credentials.2fa')}</Heading>
          <TwoFactor userId={userId} />
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
        const session = await getServerSession(req, res, authOptions)

        if (session) {
          const response = await store.dispatch(
            getOtpRequiredForLogin.initiate({ userId: session.user.id })
          )

          if (!response.data?.otpRequiredForLogin) {
            store.dispatch(getQrCodeUri.initiate({ userId: session.user.id }))
          }

          await Promise.all(
            store.dispatch(apiGraphql.util.getRunningQueriesThunk())
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
              userId: session.user.id,
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
