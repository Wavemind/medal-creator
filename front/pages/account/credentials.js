/**
 * The external imports
 */
import { useEffect } from 'react'
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
  SimpleGrid,
} from '@chakra-ui/react'

/**
 * The internal imports
 */
import Layout from '/lib/layouts/default'
import { TwoFactorAuth, Page } from '/components'
import {
  getCredentials,
  getRunningOperationPromises,
} from '/lib/services/modules/webauthn'
import { wrapper } from '/lib/store'
import { setSession } from '/lib/store/session'

export default function Credentials() {
  const { t } = useTranslation(['account', 'common'])
  const {
    handleSubmit,
    register,
    formState: { isSubmitting },
  } = useForm()

  const onSubmit = values => {
    // TODO connect this to the backend when it exists
    console.log(values)
  }

  return (
    <Page title={t('credentials.title')}>
      <SimpleGrid columns={2} spacing={10}>
        <Box>
          <Heading mb={10}>{t('credentials.header')}</Heading>
          <form onSubmit={handleSubmit(onSubmit)}>
            <FormControl>
              <VStack align='left' spacing={12}>
                <Box>
                  <FormLabel>{t('credentials.password')}</FormLabel>
                  <Input
                    id='password'
                    type='password'
                    {...register('password')}
                  />
                </Box>
                <Box>
                  <FormLabel>{t('credentials.confirmation')}</FormLabel>
                  <Input
                    id='password_confirmation'
                    type='password'
                    {...register('confirmation')}
                  />
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
        <Box>
          <TwoFactorAuth />
        </Box>
      </SimpleGrid>
    </Page>
  )
}

Credentials.getLayout = function getLayout(page) {
  return <Layout menuType='account'>{page}</Layout>
}

export const getServerSideProps = wrapper.getServerSideProps(
  store =>
    async ({ locale, req, res }) => {
      await store.dispatch(
        setSession(JSON.parse(getCookie('session', { req, res })))
      )
      store.dispatch(getCredentials.initiate())
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
        },
      }
    }
)
