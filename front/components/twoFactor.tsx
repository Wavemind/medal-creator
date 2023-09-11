/**
 * The external imports
 */
import React from 'react'
import { Trans, useTranslation } from 'next-i18next'
import {
  VStack,
  Center,
  Text,
  Box,
  HStack,
  Button,
  Alert,
  AlertDescription,
  AlertIcon,
  AlertTitle,
} from '@chakra-ui/react'
import { QRCodeSVG } from 'qrcode.react'
import { yupResolver } from '@hookform/resolvers/yup'
import * as yup from 'yup'
import { useForm } from 'react-hook-form'

/**
 * The internal imports
 */
import {
  useDisable2faMutation,
  useGetOtpRequiredForLoginQuery,
  useGetQrCodeUriQuery,
  useEnable2faMutation,
} from '@/lib/api/modules/enhanced/twoFactor.enhanced'
import FormProvider from '@/components/formProvider'
import ErrorMessage from '@/components/errorMessage'
import Input from '@/components/inputs/input'
import type { AuthComponent } from '@/types'
import type { Enable2faMutationVariables } from '@/lib/api/modules/generated/twoFactor.generated'

const TwoFactor: AuthComponent = ({ userId }) => {
  const { t } = useTranslation('account')

  const { data: qrCodeUri, isSuccess: isGetQrCodeUriSuccess } =
    useGetQrCodeUriQuery({ userId })

  const {
    data,
    isSuccess: isGetOtpRequiredForLoginSuccess,
    isError: isGetOtpRequiredForLoginError,
    error: getOtpRequiredForLoginError,
  } = useGetOtpRequiredForLoginQuery({ userId })

  const [
    enable2fa,
    {
      isSuccess: isEnable2faSuccess,
      isError: isEnable2faError,
      error: enable2faError,
      isLoading: isEnable2faLoading,
    },
  ] = useEnable2faMutation()

  const [
    disable2fa,
    {
      isSuccess: isDisable2faSuccess,
      isError: isDisable2faError,
      error: disable2faError,
      isLoading: isDisable2faLoading,
    },
  ] = useDisable2faMutation()

  const methods = useForm<Enable2faMutationVariables>({
    resolver: yupResolver(
      yup.object({
        code: yup.string().label(t('credentials.code')).required(),
        password: yup
          .string()
          .label(t('credentials.currentPassword'))
          .required(),
      })
    ),
    reValidateMode: 'onSubmit',
    defaultValues: {
      userId,
      code: '',
      password: '',
    },
  })

  const handleEnable2fa = (data: Enable2faMutationVariables) => enable2fa(data)
  const handleDisable2fa = () => disable2fa({ userId })

  if (isGetOtpRequiredForLoginSuccess && data.otpRequiredForLogin) {
    return (
      <React.Fragment>
        <Alert
          status='success'
          variant='subtle'
          flexDirection='column'
          alignItems='center'
          justifyContent='center'
          gap={4}
          textAlign='center'
          height={200}
        >
          <AlertIcon boxSize='40px' mr={0} />
          <AlertTitle mt={4} mb={1} fontSize='lg'>
            {t('credentials.2faEnabled')}
          </AlertTitle>
          <AlertDescription>
            <Button
              variant='outline'
              size='sm'
              onClick={handleDisable2fa}
              isLoading={isDisable2faLoading}
            >
              {t('credentials.disable2fa')}
            </Button>
          </AlertDescription>
        </Alert>
        <Box mt={6} textAlign='center'>
          {isDisable2faError && <ErrorMessage error={disable2faError} />}
        </Box>
      </React.Fragment>
    )
  }

  return (
    <VStack spacing={10} px={24}>
      <Text>{t('credentials.scanInstructions')}</Text>
      {isGetQrCodeUriSuccess && (
        <>
          <Center>
            {qrCodeUri.otpProvisioningUri && (
              <QRCodeSVG value={qrCodeUri.otpProvisioningUri} size={200} />
            )}
          </Center>
          <Text textAlign='center'>
            <Trans
              i18nKey='credentials.manualInstructions'
              values={{ otpSecret: qrCodeUri.otpSecret }}
              t={t}
              components={{
                r: <Text as='span' color='secondary' />,
              }}
            />
          </Text>
        </>
      )}
      <Box w='full'>
        <FormProvider<Enable2faMutationVariables>
          methods={methods}
          isError={
            isEnable2faError ||
            isDisable2faError ||
            isGetOtpRequiredForLoginError
          }
          error={{
            ...enable2faError,
            ...disable2faError,
            ...getOtpRequiredForLoginError,
          }}
          isSuccess={isDisable2faSuccess || isEnable2faSuccess}
          callbackAfterSuccess={() => methods.reset()}
        >
          <form onSubmit={methods.handleSubmit(handleEnable2fa)}>
            <VStack align='left' spacing={4}>
              <Input
                label={t('credentials.code')}
                name='code'
                type='number'
                isRequired
              />
              <Input
                label={t('credentials.currentPassword')}
                name='password'
                type='password'
                isRequired
              />
              <HStack justifyContent='flex-end'>
                <Button type='submit' mt={6} isLoading={isEnable2faLoading}>
                  {t('credentials.enable2fa')}
                </Button>
              </HStack>
            </VStack>
          </form>
        </FormProvider>
      </Box>
    </VStack>
  )
}

export default TwoFactor
