/**
 * The external imports
 */
import { useEffect } from 'react'
import { Alert, AlertDescription, AlertIcon, Box } from '@chakra-ui/react'
import { useTranslation } from 'next-i18next'
import camelCase from 'lodash/camelCase'
import capitalize from 'lodash/capitalize'
import {
  FieldValues,
  FormProvider as RHFFormProvider,
  Path,
} from 'react-hook-form'

/**
 * The internal imports
 */
import {
  isFetchBaseQueryError,
  isGraphqlError,
} from '@/lib/utils/errorsHelpers'
import { useToast } from '@/lib/hooks'
import ErrorMessage from '@/components/errorMessage'
import type { FormProviderComponents } from '@/types'

const FormProvider = <T extends FieldValues>({
  methods,
  isError,
  error,
  isSuccess,
  callbackAfterSuccess,
  children,
}: FormProviderComponents<T>) => {
  const { t } = useTranslation('common')
  const { newToast } = useToast()

  useEffect(() => {
    console.log(error, isError, isFetchBaseQueryError(error))
    if (isError && isGraphqlError(error)) {
      const { message } = error

      Object.keys(message).forEach(key => {
        methods.setError(camelCase(key) as Path<T>, {
          message: capitalize(message[key]),
        })
      })
    } else if (isError && isFetchBaseQueryError(error)) {
      console.log('je rentre la ?', error.data.errors)
      Object.keys(error.data.errors).forEach(key => {
        methods.setError(camelCase(key) as Path<T>, {
          message: capitalize(error.data.errors[key][0]),
        })
      })
    }
  }, [isError])

  useEffect(() => {
    if (isSuccess) {
      newToast({
        message: t('notifications.saveSuccess'),
        status: 'success',
      })
      if (callbackAfterSuccess) {
        callbackAfterSuccess()
      }
    }
  }, [isSuccess])

  return (
    <>
      {/* {isError && Object.keys(methods.formState.errors).length === 0 && (
        <Box w='full'>
          <Alert status='warning' mb={4} borderRadius='2xl'>
            <AlertIcon />
            <AlertDescription>
              <ErrorMessage error={error} />
            </AlertDescription>
          </Alert>
        </Box>
      )} */}
      <RHFFormProvider {...methods}>{children}</RHFFormProvider>
    </>
  )
}

export default FormProvider
