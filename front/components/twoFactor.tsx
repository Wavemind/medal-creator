/**
 * The external imports
 */
import React, { FC, useEffect } from 'react'
import { Trans, useTranslation } from 'next-i18next'
import { VStack, Center, Text, Box, HStack, Button } from '@chakra-ui/react'
import { QRCodeSVG } from 'qrcode.react'
import { yupResolver } from '@hookform/resolvers/yup'
import * as yup from 'yup'
import { FormProvider, useForm } from 'react-hook-form'

/**
 * The internal imports
 */
import {
  useDisable2faMutation,
  useGetOtpRequiredForLoginQuery,
  useGetQrCodeUriQuery,
} from '@/lib/services/modules/twoFactor'
import { useToast } from '@/lib/hooks'
import { FormError, Input } from '@/components'
import { useEnable2faMutation } from '@/lib/services/modules/twoFactor'
import type { ConfirmCode, CredentialsProps } from '@/types/twoFactor'

const TwoFactor: FC<CredentialsProps> = ({ userId }) => {
  const { t } = useTranslation(['account', 'common'])
  const { newToast } = useToast()

  const { data: qrCodeUri } = useGetQrCodeUriQuery(userId)

  const {
    data,
    isSuccess: isGetOtpRequiredForLoginSuccess,
    isError: isGetOtpRequiredForLoginError,
  } = useGetOtpRequiredForLoginQuery(userId)

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
  const methods = useForm<ConfirmCode>({
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
      code: '',
      password: '',
    },
  })

  /**
   * Sends request to the backend to confirm codes and enable 2FA
   */
  const handleEnable2fa = (data: ConfirmCode) => {
    enable2fa({ userId, ...data })
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
    return (
      <Center>
        <Text>An error has occured</Text>
      </Center>
    )
  }

  if (isGetOtpRequiredForLoginSuccess && data.otpRequiredForLogin) {
    return (
      <React.Fragment>
        <Text>{t('credentials.2faEnabled')}</Text>
        <Button
          variant='delete'
          onClick={handleDisable2fa}
          isLoading={isDisable2faLoading}
        >
          {t('credentials.disable2fa')}
        </Button>

        <Box mt={6} textAlign='center'>
          {isDisable2faError && <FormError error={disable2faError} />}
        </Box>
      </React.Fragment>
    )
  }

  return (
    <VStack spacing={10} px={24}>
      <Text>{t('credentials.scanInstructions')}</Text>
      <Center>
        {qrCodeUri?.otpProvisioningUri && (
          <QRCodeSVG value={qrCodeUri?.otpProvisioningUri} size={200} />
        )}
      </Center>
      <Text textAlign='center'>
        <Trans
          i18nKey='credentials.manualInstructions'
          values={{ otpSecret: qrCodeUri?.otpSecret }}
          t={t}
          components={{
            r: <Text as='span' color='secondary' />,
          }}
        />
      </Text>
      <Box w='full'>
        <FormProvider {...methods}>
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
                {isEnable2faError && <FormError error={enable2faError} />}
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
