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

export default function Password() {
  const {
    handleSubmit,
    register,
    formState: { isSubmitting },
  } = useForm()

  const { t } = useTranslation('account')

  const onSubmit = (values) => {
    // TODO connect this to the backend when it exists
    console.log(values)
  }

  return (
    <Box>
      <Heading mb={10}>{t('password.title')}</Heading>
      <Box w="50%">
        <form onSubmit={handleSubmit(onSubmit)}>
          <FormControl>
            <VStack align="left" spacing={12}>
              <Box>
                <FormLabel>{t('password.password')}</FormLabel>
                <Input id="password" type="password" {...register('password')} />
              </Box>
              <Box>
                <FormLabel>{t('password.confirmation')}</FormLabel>
                <Input id="confirmation" type="password" {...register('confirmation')} />
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

Password.getLayout = function getLayout(page) {
  return <Layout menuType="account">{page}</Layout>
}

export const getServerSideProps = async ({ locale }) => ({
  props: {
    ...(await serverSideTranslations(locale, ['common', 'account', 'submenu'])),
  },
})