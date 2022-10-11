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
  Textarea,
} from '@chakra-ui/react'

/**
 * The internal imports
 */
import { Select } from '/components'

const CreateAlgorithmForm = () => {
  const { t } = useTranslation('algorithms')

  const methods = useForm()

  const onSubmit = data => {
    console.log(data)
  }

  // TODO : These will probably come from somewhere else
  const options = [
    { value: 'option1', label: 'Option 1' },
    { value: 'option2', label: 'Option 2' },
    { value: 'option3', label: 'Option 3' },
  ]

  return (
    <FormProvider {...methods}>
      <form onSubmit={methods.handleSubmit(onSubmit)}>
        <FormControl>
          <VStack align='left' spacing={8}>
            <Box>
              <FormLabel>{t('name')}</FormLabel>
              <Input id='name' name='name' {...methods.register('name')} />
            </Box>
            <Box>
              <FormLabel>{t('description')}</FormLabel>
              <Textarea
                id='description'
                name='description'
                {...methods.register('description')}
              />
            </Box>
            <Select label={t('type')} name='type' options={options} />
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
