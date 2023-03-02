/**
 * The external imports
 */
import { ReactElement, useEffect } from 'react'
import { FormProvider, useForm } from 'react-hook-form'
import { serverSideTranslations } from 'next-i18next/serverSideTranslations'
import { useTranslation } from 'next-i18next'
import { yupResolver } from '@hookform/resolvers/yup'
import * as yup from 'yup'
import { VStack, Button, Box, Heading, HStack } from '@chakra-ui/react'
import { GetServerSidePropsContext } from 'next'

/**
 * The internal imports
 */
import Layout from '@/lib/layouts/default'
import { Page, Input, FormError } from '@/components'
import { wrapper } from '@/lib/store'
import { useToast } from '@/lib/hooks'
import {
  getUser,
  useGetUserQuery,
  useUpdateUserMutation,
} from '@/lib/services/modules/user'
import { apiGraphql } from '@/lib/services/apiGraphql'
import { getServerSession } from 'next-auth'
import { authOptions } from '../api/auth/[...nextauth]'

/**
 * Type definitions
 */
type InformationProps = {
  userId: number
}

export default function Information({ userId }: InformationProps) {
  const { t } = useTranslation('account')
  const { newToast } = useToast()

  const { data } = useGetUserQuery(userId)

  const [updateUser, { isSuccess, isError, isLoading, error }] =
    useUpdateUserMutation()

  /**
   * Setup form configuration
   */
  const methods = useForm({
    resolver: yupResolver(
      yup.object({
        firstName: yup.string().label('information.firstName').required(),
        lastName: yup.string().label('information.lastName').required(),
        email: yup.string().email().label('information.email').required(),
      })
    ),
    reValidateMode: 'onSubmit',
    defaultValues: data,
  })

  useEffect(() => {
    if (isSuccess) {
      newToast({
        message: t('notifications.updateSuccess', { ns: 'common' }),
        status: 'success',
      })
    }
  }, [isSuccess])

  // TODO: FIX USER ROLE

  return (
    <Page title={t('information.title')}>
      <Heading mb={10}>{t('information.header')}</Heading>
      <Box w='50%'>
        <FormProvider {...methods}>
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
              <Input label={t('information.email')} name='email' isRequired />
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
        const currentUser = await getServerSession(req, res, authOptions)
        if (currentUser) {
          store.dispatch(getUser.initiate(currentUser.user.id))
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
              userId: currentUser.user.id,
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
