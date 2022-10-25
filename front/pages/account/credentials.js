/**
 * The external imports
 */
import { useEffect } from 'react'
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
  Text,
} from '@chakra-ui/react'
import { yupResolver } from '@hookform/resolvers/yup'
import * as yup from 'yup'

/**
 * The internal imports
 */
import BareLayout from '/lib/layouts/bare'
import { TwoFactorAuth, Page, Input } from '/components'
import {
  getCredentials,
  getRunningOperationPromises,
} from '/lib/services/modules/webauthn'
import { wrapper } from '/lib/store'
import { setSession } from '/lib/store/session'
import { useToast } from '/lib/hooks'
import { useUpdatePasswordMutation } from '/lib/services/modules/user'
import getUserBySession from '/lib/utils/getUserBySession'

export default function Credentials({ userId }) {
  const { t } = useTranslation(['account', 'common'])
  const { newToast } = useToast()

  const [updatePassword, updatePasswordValues] = useUpdatePasswordMutation()

  /**
   * Setup form configuration
   */
  const methods = useForm({
    resolver: yupResolver(
      yup.object({
        password: yup.string().required(t('required', { ns: 'validations' })),
        passwordConfirmation: yup
          .string()
          .required(t('required', { ns: 'validations' })),
      })
    ),
    reValidateMode: 'onSubmit',
    defaultValues: { id: userId, password: '', passwordConfirmation: '' },
  })

  useEffect(() => {
    if (updatePasswordValues.isSuccess) {
      newToast({
        message: t('notifications.updateSuccess'),
        status: 'success',
      })
    }
  }, [updatePasswordValues.isSuccess])

  return (
    <Page title={t('credentials.title')}>
      <SimpleGrid columns={2} spacing={10}>
        <Box>
          <Heading mb={10}>{t('credentials.header')}</Heading>
          <FormProvider {...methods}>
            <form onSubmit={methods.handleSubmit(updatePassword)}>
              <VStack align='left' spacing={12}>
                <Input
                  source='credentials'
                  name='password'
                  type='password'
                  required
                />
                <Input
                  source='credentials'
                  name='passwordConfirmation'
                  type='password'
                  required
                />

                <Box mt={6} textAlign='center'>
                  {updatePasswordValues.isError && (
                    <Text fontSize='m' color='red' data-cy='server_message'>
                      {typeof updatePasswordValues.error.error === 'string'
                        ? updatePasswordValues.error.error
                        : updatePasswordValues.error.message}
                    </Text>
                  )}
                </Box>
                <HStack justifyContent='flex-end'>
                  <Button type='submit' mt={6} isLoading={methods.isSubmitting}>
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

Credentials.getLayout = function getLayout(page) {
  return <BareLayout menuType='account'>{page}</BareLayout>
}

export const getServerSideProps = wrapper.getServerSideProps(
  store =>
    async ({ locale, req, res }) => {
      const currentUser = getUserBySession(req, res)
      await store.dispatch(setSession(currentUser))
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
          userId: currentUser.userId,
        },
      }
    }
)
