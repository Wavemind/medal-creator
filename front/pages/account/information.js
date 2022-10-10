/**
 * The external imports
 */
import { useForm } from 'react-hook-form'
import { serverSideTranslations } from 'next-i18next/serverSideTranslations'
import { useTranslation } from 'next-i18next'
import { getCookie } from 'cookies-next'
import {
  Input,
  VStack,
  FormLabel,
  FormControl,
  Button,
  Box,
  Heading,
  HStack,
} from '@chakra-ui/react'

/**
 * The internal imports
 */
import Layout from '/lib/layouts/default'
import { Page } from '/components'
import { wrapper } from '/lib/store'
import { setSession } from '/lib/store/session'
import {
  getUser,
  useGetUserQuery,
  getRunningOperationPromises,
} from '/lib/services/modules/user'

export default function Information({ userId }) {
  const { t } = useTranslation('account')

  const { data } = useGetUserQuery(userId)

  const {
    handleSubmit,
    register,
    formState: { isSubmitting },
  } = useForm({ defaultValues: data })

  const onSubmit = values => {
    // TODO connect this to the backend when it exists
    console.log(values)
  }

  return (
    <Page title={t('information.title')}>
      <Heading mb={10}>{t('information.header')}</Heading>
      <Box w='50%'>
        <form onSubmit={handleSubmit(onSubmit)}>
          <FormControl>
            <VStack align='left' spacing={12}>
              <Box>
                <FormLabel>{t('information.firstName')}</FormLabel>
                <Input id='firstName' {...register('firstName')} />
              </Box>
              <Box>
                <FormLabel>{t('information.lastName')}</FormLabel>
                <Input id='lastName' {...register('lastName')} />
              </Box>
              <Box>
                <FormLabel>{t('information.email')}</FormLabel>
                <Input id='email' {...register('email')} />
              </Box>
              <HStack justifyContent='flex-end'>
                <Button type='submit' mt={6} isLoading={isSubmitting}>
                  {t('save', { ns: 'common' })}
                </Button>
              </HStack>
            </VStack>
          </FormControl>
        </form>
      </Box>
    </Page>
  )
}

Information.getLayout = function getLayout(page) {
  return <Layout menuType='account'>{page}</Layout>
}

export const getServerSideProps = wrapper.getServerSideProps(
  store =>
    async ({ locale, req, res }) => {
      const userId = await JSON.parse(getCookie('session', { req, res })).userId
      await store.dispatch(
        setSession(JSON.parse(getCookie('session', { req, res })))
      )
      store.dispatch(getUser.initiate(userId))
      await Promise.all(getRunningOperationPromises())

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
          userId,
        },
      }
    }
)
