/**
 * The external imports
 */
import { useEffect, useContext } from 'react'
import { useForm } from 'react-hook-form'
import { useTranslation } from 'next-i18next'
// import { create } from '@github/webauthn-json'
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
  useDeleteCredentialMutation,
  useGetCredentialsQuery,
} from '/lib/services/modules/webauthn'
import { DeleteIcon } from '/assets/icons'
import { AlertDialogContext } from '/lib/contexts'

// TODO: DROPPED

export default function TwoFactorAuth() {
  const { t } = useTranslation(['account', 'common', 'validations'])
  const {
    handleSubmit,
    reset,
    register,
    getValues,
    formState: { errors },
  } = useForm()

  const { openAlertDialog } = useContext(AlertDialogContext)

  const [generateChallenge, challengeValues] = useGenerateChallengeMutation()
  const [addCredential] = useAddCredentialMutation()
  const [deleteCredential] = useDeleteCredentialMutation()
  const { data: credentials } = useGetCredentialsQuery()

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
  }, [challengeValues.isSuccess])

  return (
    <Box>
      <Heading mb={10}>{t('credentials.2fa')}</Heading>
      {credentials.length > 0 ? (
        <TableContainer>
          <Table>
            <Tbody>
              {credentials.map(credential => (
                <Tr key={credential.id}>
                  <Td>{credential.name}</Td>
                  <Td textAlign='right'>
                    <IconButton
                      variant='outline'
                      colorScheme='red'
                      onClick={() =>
                        openAlertDialog({
                          title: credential.name,
                          content: t('areYouSure', { ns: 'common' }),
                          action: () => deleteCredential({ id: credential.id }),
                        })
                      }
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
            {t('credentials.missing2FATitle')}
          </AlertTitle>
          <AlertDescription maxWidth='sm'>
            {t('credentials.missing2FADescription')}
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
