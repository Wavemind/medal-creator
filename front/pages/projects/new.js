/**
 * The external imports
 */
import { Heading, Box, SimpleGrid, VStack, Button } from '@chakra-ui/react'
import { useTranslation } from 'next-i18next'
import { useForm, FormProvider } from 'react-hook-form'
import { yupResolver } from '@hookform/resolvers/yup'
import * as yup from 'yup'
import { serverSideTranslations } from 'next-i18next/serverSideTranslations'

/**
 * The internal imports
 */
import { Page, RichText, Input, Checkbox, Textarea, Select } from '/components'
import Layout from '/lib/layouts/default'
import { wrapper } from '/lib/store'
import { setSession } from '/lib/store/session'
import {
  getLanguages,
  useGetLanguagesQuery,
  getRunningOperationPromises,
} from '/lib/services/modules/language'

import { getUsers, useGetUsersQuery } from '/lib/services/modules/user'
import getUserBySession from '/lib/utils/getUserBySession'

export default function NewProject() {
  const { t } = useTranslation(['project', 'common'])

  const { data: languages } = useGetLanguagesQuery()
  const { data: users } = useGetUsersQuery()

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
    defaultValues: {},
  })

  return (
    <Page title={t('title')}>
      <Box mx={32}>
        <Heading variant='h1' mb={10}>
          {t('title')}
        </Heading>
        <FormProvider {...methods}>
          <form onSubmit={methods.handleSubmit('TODO')}>
            <VStack align='left' spacing={6}>
              <Input label={t('form.name')} name='name' required />
              <Checkbox
                label={t('form.consentManagement')}
                name='consentManagement'
              />
              <Checkbox
                label={t('form.displayReferral')}
                name='displayReferral'
              />
              <Textarea label={t('form.description')} name='description' />
              <Select
                label={t('form.defaultLanguage')}
                name='defaultLanguage'
                options={languages}
                valueOption='id'
                labelOption='name'
                required
              />
              <SimpleGrid columns={2} spacing={10}>
                <RichText
                  label={t('form.emergencyContent')}
                  name='emergencyContent'
                  required
                />
                <RichText
                  label={t('form.studyDescription')}
                  name='studyDescription'
                  required
                />
              </SimpleGrid>
              <Button type='submit'>{t('save', { ns: 'common' })}</Button>
            </VStack>
          </form>
        </FormProvider>
      </Box>
    </Page>
  )
}

export const getServerSideProps = wrapper.getServerSideProps(
  store =>
    async ({ locale, req, res }) => {
      const currentUser = getUserBySession(req, res)
      await store.dispatch(setSession(currentUser))
      store.dispatch(getLanguages.initiate())
      store.dispatch(getUsers.initiate())
      await Promise.all(getRunningOperationPromises())

      // Translations
      const translations = await serverSideTranslations(locale, [
        'project',
        'common',
      ])

      return {
        props: {
          ...translations,
        },
      }
    }
)

NewProject.getLayout = function getLayout(page) {
  return <Layout showSideBar={false}>{page}</Layout>
}
