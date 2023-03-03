/**
 * The external imports
 */
import { ReactElement } from 'react'
import { serverSideTranslations } from 'next-i18next/serverSideTranslations'
import { useTranslation } from 'next-i18next'
import { Box, Heading, SimpleGrid } from '@chakra-ui/react'
import { GetServerSidePropsContext } from 'next'
import { getServerSession } from 'next-auth'

/**
 * The internal imports
 */
import Layout from '@/lib/layouts/default'
import { Page, ChangePasswordForm, TwoFactor } from '@/components'
import { wrapper } from '@/lib/store'
import { authOptions } from '@/pages/api/auth/[...nextauth]'
import { apiGraphql } from '@/lib/services/apiGraphql'
import {
  getOtpRequiredForLogin,
  getQrCodeUri,
} from '@/lib/services/modules/twoFactor'
import type { CredentialsProps } from '@/types/twoFactor'

export default function Credentials({ userId }: CredentialsProps) {
  const { t } = useTranslation(['account', 'common'])

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
        const currentUser = await getServerSession(req, res, authOptions)

        if (currentUser) {
          // TODO CHECK HOW GET BACK FULLFIELD
          const response = await store.dispatch(
            getOtpRequiredForLogin.initiate(currentUser.user.id)
          )

          if (!response.data?.otpRequiredForLogin) {
            store.dispatch(getQrCodeUri.initiate(currentUser.user.id))
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
