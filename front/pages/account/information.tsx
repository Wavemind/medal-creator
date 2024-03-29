/**
 * The external imports
 */
import { ReactElement } from 'react'
import { useForm } from 'react-hook-form'
import { serverSideTranslations } from 'next-i18next/serverSideTranslations'
import { useTranslation } from 'next-i18next'
import { yupResolver } from '@hookform/resolvers/yup'
import * as yup from 'yup'
import { VStack, Button, Box, Heading, HStack } from '@chakra-ui/react'
import { getServerSession } from 'next-auth'
import { useSession } from 'next-auth/react'
import type { GetServerSidePropsContext } from 'next'

/**
 * The internal imports
 */
import Layout from '@/lib/layouts/default'
import Page from '@/components/page'
import Input from '@/components/inputs/input'
import FormProvider from '@/components/formProvider'
import { wrapper } from '@/lib/store'
import {
  useGetUserQuery,
  useUpdateUserMutation,
  getUser,
} from '@/lib/api/modules/enhanced/user.enhanced'
import { apiGraphql } from '@/lib/api/apiGraphql'
import { authOptions } from '@/pages/api/auth/[...nextauth]'
import type { UserId } from '@/types'
import type { UpdateUserMutationVariables } from '@/lib/api/modules/generated/user.generated'

export default function Information({ userId }: UserId) {
  const { t } = useTranslation('account')

  const { update } = useSession()

  const { data: user } = useGetUserQuery({ id: userId })
  const [
    updateUser,
    { data: updatedUser, isSuccess, isError, isLoading, error },
  ] = useUpdateUserMutation()

  /**
   * Setup form configuration
   */
  const methods = useForm<UpdateUserMutationVariables>({
    resolver: yupResolver(
      yup.object({
        firstName: yup.string().label(t('information.firstName')).required(),
        lastName: yup.string().label(t('information.lastName')).required(),
        email: yup.string().email().label(t('information.email')).required(),
      })
    ),
    reValidateMode: 'onSubmit',
    defaultValues: {
      id: user?.id,
      firstName: user?.firstName,
      lastName: user?.lastName,
      email: user?.email,
      role: user?.role,
    },
  })

  const handleSuccess = () => {
    if (updatedUser) {
      update({ user: updatedUser.user })
    }
  }

  return (
    <Page title={t('information.title')}>
      <Heading mb={10}>{t('information.header')}</Heading>
      <Box w='50%'>
        <FormProvider<UpdateUserMutationVariables>
          methods={methods}
          isError={isError}
          error={error}
          isSuccess={isSuccess}
          callbackAfterSuccess={handleSuccess}
        >
          <form onSubmit={methods.handleSubmit(updateUser)}>
            <VStack align='left' spacing={12}>
              <Input
                label={t('information.firstName')}
                name='firstName'
                isRequired
              />
              <Input
                label={t('information.lastName')}
                name='lastName'
                isRequired
              />
              <Input
                type='email'
                label={t('information.email')}
                name='email'
                isRequired
              />
              <HStack justifyContent='flex-end'>
                <Button type='submit' mt={6} isLoading={isLoading}>
                  {t('save', { ns: 'common' })}
                </Button>
              </HStack>
            </VStack>
          </form>
        </FormProvider>
      </Box>
    </Page>
  )
}

Information.getLayout = function getLayout(page: ReactElement) {
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
          store.dispatch(getUser.initiate({ id: session.user.id }))
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
