/**
 * The external imports
 */
import { FormProvider, useForm } from 'react-hook-form'
import { useTranslation } from 'next-i18next'
import {
  Input,
  VStack,
  FormLabel,
  FormControl,
  Button,
  Box,
  HStack,
} from '@chakra-ui/react'

const CreateAlgorithmForm = () => {
  const { t } = useTranslation('users')

  const methods = useForm()

  const onSubmit = data => {
    console.log(data)
  }

  return (
    <FormProvider {...methods}>
      <form onSubmit={methods.handleSubmit(onSubmit)}>
        <FormControl>
          <VStack align='left' spacing={8}>
            <HStack spacing={4}>
              <Box>
                <FormLabel>{t('firstName')}</FormLabel>
                <Input
                  id='firstName'
                  name='firstName'
                  {...methods.register('firstName')}
                />
              </Box>
              <Box>
                <FormLabel>{t('lastName')}</FormLabel>
                <Input
                  id='lastName'
                  name='lastName'
                  {...methods.register('lastName')}
                />
              </Box>
            </HStack>
            <Box>
              <FormLabel>{t('email')}</FormLabel>
              <Input id='email' name='email' {...methods.register('email')} />
            </Box>
            <HStack justifyContent='flex-end'>
              <Button
                type='submit'
                mt={6}
                isLoading={methods.formState.isSubmitting}
              >
                {t('save', { ns: 'common' })}
              </Button>
            </HStack>
          </VStack>
        </FormControl>
      </form>
    </FormProvider>
  )
}

export default CreateAlgorithmForm
