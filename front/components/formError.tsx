/**
 * The external imports
 */
import { FC, useMemo } from 'react'
import { Text } from '@chakra-ui/react'

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
  const errorMessage = useMemo(() => {
    if (isFetchBaseQueryError(error)) {
      return 'error' in error ? error.error : error.data.errors.join()
    } else if (isErrorWithMessage(error)) {
      return error.message
    } else {
      return ''
    }
  }, [error])

  return (
    <Text fontSize='m' color='red' data-cy='server_message'>
      {errorMessage}
    </Text>
  )
}

export default FormError
