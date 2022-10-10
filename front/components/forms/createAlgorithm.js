/**
 * The external imports
 */
import { useForm } from 'react-hook-form'
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
  Select,
} from '@chakra-ui/react'

const CreateAlgorithmForm = () => {
  const { t } = useTranslation()

  const {
    handleSubmit,
    register,
    formState: { isSubmitting },
  } = useForm()

  const onSubmit = data => {
    console.log(data)
  }

  return (
    <form onSubmit={handleSubmit(onSubmit)}>
      <FormControl>
        <VStack align='left' spacing={8}>
          <Box>
            <FormLabel>Nom</FormLabel>
            <Input id='nom' {...register('nom')} />
          </Box>
          <Box>
            <FormLabel>Description</FormLabel>
            <Textarea id='description' {...register('description')} />
          </Box>
          <Box>
            <FormLabel>Type</FormLabel>
            <Select id='type' {...register('type')} placeholder='Select option'>
              <option value='option1'>Option 1</option>
              <option value='option2'>Option 2</option>
              <option value='option3'>Option 3</option>
            </Select>
          </Box>
          <HStack justifyContent='flex-end'>
            <Button type='submit' mt={6} isLoading={isSubmitting}>
              {t('save', { ns: 'common' })}
            </Button>
          </HStack>
        </VStack>
      </FormControl>
    </form>
  )
}

export default CreateAlgorithmForm
