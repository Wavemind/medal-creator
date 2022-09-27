/**
 * The external imports
 */
import { useEffect } from 'react'
import { useForm } from 'react-hook-form'
import { useTranslation } from 'next-i18next'
import { create } from '@github/webauthn-json'
import {
  Input,
  FormControl,
  Button,
  Box,
  Heading,
  TableContainer,
  Table,
  Alert,
  AlertIcon,
  AlertTitle,
  AlertDescription,
  Tr,
  Tbody,
  Td,
  FormErrorMessage,
  IconButton,
  InputGroup,
  InputRightAddon,
} from '@chakra-ui/react'

/**
 * The internal imports
 */
import {
  useGenerateChallengeMutation,
  useAddCredentialMutation,
  useGetCredentialsQuery,
  useDeleteCredentialMutation,
} from '../lib/services/modules/webauthn'
import { DeleteIcon } from '../assets/icons'

export default function Password() {
  const { t } = useTranslation(['account', 'common', 'validations'])
  const {
    handleSubmit,
    reset,
    register,
    getValues,
    formState: { errors },
  } = useForm()

  const [generateChallenge, challengeValues] = useGenerateChallengeMutation()
  const [addCredential] = useAddCredentialMutation()
  const [deleteCredential] = useDeleteCredentialMutation()
  const credentials = useGetCredentialsQuery()
  console.log(credentials.data)
  useEffect(() => {
    if (challengeValues.isSuccess) {
      create({
        publicKey: challengeValues.data,
      })
        .then(newCredentialInfo => {
          const name = getValues('name')
          addCredential({
            credential: newCredentialInfo,
            challenge: challengeValues.data.challenge,
            name,
          })
          reset()
        })
        .catch(error => {
          console.log('FAIL', error)
        })
    }
  }, [challengeValues.isLoading])

  return (
    <Box>
      <Heading mb={10}>2FA</Heading>
      {credentials.data?.length > 0 ? (
        <TableContainer>
          <Table>
            <Tbody>
              {credentials.data.map(credential => (
                <Tr key={credential.id}>
                  <Td>{credential.name}</Td>
                  <Td textAlign='right'>
                    <IconButton
                      variant='outline'
                      colorScheme='red'
                      onClick={() => deleteCredential({ id: credential.id })}
                      icon={<DeleteIcon boxSize={6} />}
                    />
                  </Td>
                </Tr>
              ))}
            </Tbody>
          </Table>
        </TableContainer>
      ) : (
        <Alert
          status='warning'
          flexDirection='column'
          alignItems='center'
          justifyContent='center'
          textAlign='center'
          height={200}
        >
          <AlertIcon boxSize='40px' mr={0} />
          <AlertTitle mt={4} mb={1} fontSize='lg'>
            Security alert
          </AlertTitle>
          <AlertDescription maxWidth='sm'>
            Please setup your 2FA
          </AlertDescription>
        </Alert>
      )}

      <form onSubmit={handleSubmit(generateChallenge)}>
        <InputGroup mt={4}>
          <FormControl isInvalid={errors.name}>
            <Input
              placeholder={t('credentials.name')}
              variant='inline'
              {...register('name', {
                required: t('required', { ns: 'validations' }),
              })}
            />
            <FormErrorMessage>
              {errors.name && errors.name.message}
            </FormErrorMessage>
          </FormControl>
          <InputRightAddon p={0}>
            <Button
              variant='inline'
              type='submit'
              isLoading={challengeValues.isLoading}
            >
              {t('add', { ns: 'common' })}
            </Button>
          </InputRightAddon>
        </InputGroup>
      </form>
    </Box>
  )
}
