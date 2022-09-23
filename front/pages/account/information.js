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
  HStack
} from '@chakra-ui/react'

/**
 * The internal imports
 */
import Layout from '/lib/layouts/default'

export default function Information() {
  // TODO Get default values from store or from DB
  const {
    handleSubmit,
    register,
    formState: { isSubmitting },
  } = useForm({
    defaultValues: {
      firstName: 'Sinan',
      lastName: 'Ucak',
      email: 'sinan.ucak@wavemind.ch'
    }
  })

  const { t } = useTranslation('account')

  const onSubmit = (values) => {
    // TODO connect this to the backend when it exists
    console.log(values)
  }

  return (
    <Box>
      <Heading mb={10}>{t('information.title')}</Heading>
      <Box w="50%">
        <form onSubmit={handleSubmit(onSubmit)}>
          <FormControl>
            <VStack align="left" spacing={12}>
              <Box>
                <FormLabel>{t('information.firstName')}</FormLabel>
                <Input id="firstName" {...register('firstName')} />
              </Box>
              <Box>
                <FormLabel>{t('information.lastName')}</FormLabel>
                <Input id="lastName" {...register('lastName')} />
              </Box>
              <Box>
                <FormLabel>{t('information.email')}</FormLabel>
                <Input id="email" {...register('email')} />
              </Box>
              <HStack justifyContent="flex-end">
                <Button type="submit" mt={6} isLoading={isSubmitting}>
                  {t('save', { ns: 'common' })}
                </Button>
              </HStack>
            </VStack>
          </FormControl>
        </form>
      </Box>
    </Box>
  )
}

Information.getLayout = function getLayout(page) {
  return <Layout menuType="account">{page}</Layout>
}

export const getServerSideProps = async ({ locale }) => ({
  props: {
    ...(await serverSideTranslations(locale, ['common', 'account', 'submenu'])),
  },
})