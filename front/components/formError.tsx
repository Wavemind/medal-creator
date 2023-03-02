/**
 * The external imports
 */
import { FC, useMemo } from 'react'
import { Text } from '@chakra-ui/react'
import { useTranslation } from 'react-i18next'

/**
 * The internal imports
 */
import {
  isFetchBaseQueryError,
  isErrorWithMessage,
} from '@/lib/utils/errorsHelpers'

/**
 * Type definitions
 */
import type { SerializedError } from '@reduxjs/toolkit'
import type { FetchBaseQueryError } from '@reduxjs/toolkit/dist/query'

type FormErrorProps = {
  error: SerializedError | FetchBaseQueryError | unknown
}

const FormError: FC<FormErrorProps> = ({ error }) => {
  const { t } = useTranslation('common')
  const errorMessage = useMemo(() => {
    if (typeof error === 'string') {
      return error
    } else if (isFetchBaseQueryError(error)) {
      return error.data.errors.join()
    } else if (isErrorWithMessage(error)) {
      return error.message
    } else {
      return t('errorBoundary.apiError')
    }
  }, [error])

  return (
    <Text fontSize='m' color='error' data-cy='server_message'>
      {errorMessage}
    </Text>
  )
}

export default FormError
