/**
 * The external imports
 */
import { useEffect, useContext } from 'react'
import { FormProvider, useForm } from 'react-hook-form'
import { useTranslation } from 'next-i18next'
import { VStack, Button, HStack, Box, Text } from '@chakra-ui/react'
import { yupResolver } from '@hookform/resolvers/yup'
import * as yup from 'yup'

/**
 * The internal imports
 */
import { useCreateUserMutation } from '/lib/services/modules/user'
import { useToast } from '/lib/hooks'
import { ModalContext } from '/lib/contexts'
import { Input } from '/components'

const CreateAlgorithmForm = () => {
  const { t } = useTranslation('users')
  const { newToast } = useToast()
  const { closeModal } = useContext(ModalContext)
  const methods = useForm({
    resolver: yupResolver(
      yup.object({
        firstName: yup.string().required(t('required', { ns: 'validations' })),
        lastName: yup.string().required(t('required', { ns: 'validations' })),
        email: yup
          .string()
          .required(t('required', { ns: 'validations' }))
          .email(t('email', { ns: 'validations' })),
      })
    ),
    reValidateMode: 'onSubmit',
    defaultValues: {
      firstName: '',
      lastName: '',
      email: '',
    },
  })

  const [createUser, { isSuccess, isError, error }] = useCreateUserMutation()

  /**
   * Calls the create user mutation with the form data
   * @param {*} data { firstName, lastName, email }
   */
  const onSubmit = data => {
    createUser(data)
  }

  /**
   * If successful, queue the toast and close the modal
   */
  useEffect(() => {
    if (isSuccess) {
      newToast({
        message: t('notifications.createSuccess', { ns: 'common' }),
        status: 'success',
      })
      closeModal()
    }
  }, [isSuccess])

  return (
    <FormProvider {...methods}>
      <form onSubmit={methods.handleSubmit(onSubmit)}>
        <VStack alignItems='flex-end' spacing={8}>
          <HStack spacing={4}>
            <Input name='firstName' label={t('firstName')} isRequired />
            <Input name='lastName' label={t('lastName')} isRequired />
          </HStack>
          <Input name='email' label={t('email')} isRequired />
          {isError && (
            <Box w='full'>
              <Text fontSize='m' color='red' data-cy='server_message'>
                {typeof error.message === 'string'
                  ? error.message.split(':')[0]
                  : error.data.errors.join()}
              </Text>
            </Box>
          )}
          <HStack justifyContent='flex-end'>
            <Button type='submit' isLoading={methods.formState.isSubmitting}>
              {t('save', { ns: 'common' })}
            </Button>
          </HStack>
        </VStack>
      </form>
    </FormProvider>
  )
}

export default CreateAlgorithmForm
