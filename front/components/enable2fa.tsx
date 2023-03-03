/**
 * The external imports
 */
import { FC, useEffect } from 'react'
import { Trans, useTranslation } from 'next-i18next'
import { VStack, Center, Text, Box, HStack, Button } from '@chakra-ui/react'
import { QRCodeSVG } from 'qrcode.react'
import { yupResolver } from '@hookform/resolvers/yup'
import * as yup from 'yup'

/**
 * The internal imports
 */
import { useGetQrCodeUriQuery } from '@/lib/services/modules/twoFactor'
import type { CredentialsProps } from '@/types/twoFactor'
import { FormProvider, useForm } from 'react-hook-form'
import { useToast } from '@/lib/hooks'
import { FormError, Input } from '@/components'
import { useEnable2faMutation } from '@/lib/services/modules/twoFactor'

/**
 * Type definitions
 */
type ConfirmCode = {
  code: string
  password: string
}

const Enable2fa: FC<CredentialsProps> = ({ userId }) => {
  const { t } = useTranslation(['account', 'common'])
  const { newToast } = useToast()

  const { data: qrCodeUri } = useGetQrCodeUriQuery(userId)

  const [enable2fa, { isError, error, isLoading, isSuccess }] =
    useEnable2faMutation()

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

  useEffect(() => {
    if (isSuccess) {
      newToast({
        message: t('notifications.updateSuccess', { ns: 'common' }),
        status: 'success',
      })
    }
  }, [isSuccess])

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
                {isError && <FormError error={error} />}
              </Box>
              <HStack justifyContent='flex-end'>
                <Button type='submit' mt={6} isLoading={isLoading}>
                  {t('confirm', { ns: 'common' })}
                </Button>
              </HStack>
            </VStack>
          </form>
        </FormProvider>
      </Box>
    </VStack>
  )
}

export default Enable2fa
