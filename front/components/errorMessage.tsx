/**
 * The external imports
 */
import { FC, useMemo } from 'react'
import { Text } from '@chakra-ui/react'
import { useTranslation } from 'react-i18next'
import type { SerializedError } from '@reduxjs/toolkit'
import type { FetchBaseQueryError } from '@reduxjs/toolkit/dist/query'

/**
 * The internal imports
 */
import {
  isFetchBaseQueryError,
  isErrorWithMessage,
  isGraphqlError,
} from '@/lib/utils'

/**
 * Type definitions
 */
type ErrorMessageProps = {
  error: SerializedError | FetchBaseQueryError | unknown
}

const ErrorMessage: FC<ErrorMessageProps> = ({ error }) => {
  const { t } = useTranslation('common')

  const errorMessage = useMemo(() => {
    if (typeof error === 'string') {
      return error
    } else if (isFetchBaseQueryError(error)) {
      return error.data.errors.join()
    } else if (isErrorWithMessage(error)) {
      return error.message
    } else if (isGraphqlError(error)) {
      return t('errorBoundary.formError')
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

export default ErrorMessage
