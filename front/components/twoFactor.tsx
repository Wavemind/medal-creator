/**
 * The external imports
 */
import React, { useEffect } from 'react'
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
import { useToast } from '@/lib/hooks'
import FormProvider from '@/components/formProvider'
import ErrorMessage from '@/components/errorMessage'
import Input from '@/components/inputs/input'
import type { AuthComponent } from '@/types'
import type { Enable2faMutationVariables } from '@/lib/api/modules/generated/twoFactor.generated'

const TwoFactor: AuthComponent = ({ userId }) => {
  const { t } = useTranslation('account')
  const { newToast } = useToast()

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

  /**
   * Setup form configuration
   */
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

  /**
   * Sends request to the backend to confirm codes and enable 2FA
   */
  const handleEnable2fa = (data: Enable2faMutationVariables) => {
    enable2fa(data)
  }

  /**
   * Sends request to backend to disable 2FA
   */
  const handleDisable2fa = () => {
    disable2fa({ userId })
  }

  useEffect(() => {
    if (isDisable2faSuccess || isEnable2faSuccess) {
      methods.reset()
      newToast({
        message: t('notifications.updateSuccess', { ns: 'common' }),
        status: 'success',
      })
    }
  }, [isDisable2faSuccess, isEnable2faSuccess])

  if (isGetOtpRequiredForLoginError) {
    return <ErrorMessage error={getOtpRequiredForLoginError} />
  }

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
          isError={isEnable2faError || isDisable2faError}
          error={{ ...enable2faError, ...disable2faError }}
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

              <Box mt={6} textAlign='center'>
                {isEnable2faError && <ErrorMessage error={enable2faError} />}
              </Box>
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
