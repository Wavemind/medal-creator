/**
 * The external imports
 */
import { useForm } from 'react-hook-form'
import { serverSideTranslations } from 'next-i18next/serverSideTranslations'
import { useTranslation } from 'next-i18next'
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
import { TwoFactorAuth } from '/components'
import {
  getCredentials,
  getRunningOperationPromises,
} from '/lib/services/modules/webauthn'
import { wrapper } from '/lib/store'

export default function Credentials() {
  const {
    handleSubmit,
    register,
    formState: { isSubmitting },
  } = useForm()

  const { t } = useTranslation(['account', 'common'])

  const onSubmit = values => {
    // TODO connect this to the backend when it exists
    console.log(values)
  }

  // TODO REFACTOR FORM

  return (
    <SimpleGrid columns={2} spacing={10}>
      <Box>
        <Heading mb={10}>{t('credentials.title')}</Heading>
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
  )
}

Credentials.getLayout = function getLayout(page) {
  return <Layout menuType='account'>{page}</Layout>
}

export const getServerSideProps = wrapper.getServerSideProps(
  store =>
    async ({ locale }) => {
      // TODO: FIXE IT
      const test = await store.dispatch(getCredentials.initiate(null))
      console.log('error', test)
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
