/**
 * The external imports
 */
import { useEffect } from 'react'
import { useForm } from 'react-hook-form'
import { useTranslation } from 'next-i18next'
import { create } from '@github/webauthn-json'
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
  TableContainer,
  Table,
  TableCaption,
  Tr,
  Tbody,
  Td,
  FormErrorMessage,
} from '@chakra-ui/react'

/**
 * The internal imports
 */
import {
  useChallengeMutation,
  useAddCredentialMutation,
} from '../lib/services/modules/auth'

export default function Password() {
  const { t } = useTranslation('account')
  const {
    handleSubmit,
    register,
    getValues,
    formState: { errors },
  } = useForm()

  const [generateChallenge, challengeValues] = useChallengeMutation()
  const [addCredential] = useAddCredentialMutation()

  // GET CREDENTIALS
  console.log(challengeValues)

  useEffect(() => {
    if (challengeValues.isSuccess) {
      create({ publicKey: { ...challengeValues.data, rp: { name: 'Test' } } })
        .then(newCredentialInfo => {
          const name = getValues('name')
          console.log('la valeur !', name)
          createCredential({
            credential: newCredentialInfo,
            challenge: challengeValues.data.challenge,
            name,
          })
        })
        .catch(error => {
          console.log('FAIL', error)
        })
    }
  }, [challengeValues.isSuccess])

  return (
    <Box>
      <Heading mb={10}>2FA</Heading>
      <TableContainer mt={2}>
        <Table variant='simple'>
          <Tbody>
            {/* {allCredentialsValues.data?.map(credential => (
                 <Tr key={credential.id}>
                   <Td>{credential.name}</Td>
                   <Td textAlign='right'>
                     <IconButton
                       variant='outline'
                       colorScheme='red'
                       onClick={() => deleteCredentials({ id: credential.id })}
                       aria-label={`Delete ${credential.name}`}
                       icon={<DeleteIcon />}
                     />
                   </Td>
                 </Tr>
               ))} */}
          </Tbody>
          <TableCaption>
            <form onSubmit={handleSubmit(generateChallenge)}>
              <FormControl isInvalid={errors.name}>
                <FormLabel>{t('name')}</FormLabel>
                <Input
                  autoFocus={true}
                  {...register('name', {
                    required: t('required', { ns: 'validations' }),
                  })}
                />
                <FormErrorMessage>
                  {errors.name && errors.name.message}
                </FormErrorMessage>
              </FormControl>
              <Button
                type='submit'
                mt={6}
                // isLoading={newSessionValues.isLoading}
              >
                {t('add')}
              </Button>
            </form>
          </TableCaption>
        </Table>
      </TableContainer>
    </Box>
  )
}
