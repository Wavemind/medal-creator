/**
 * The external imports
 */
import { useMemo } from 'react'
import { Text } from '@chakra-ui/react'
import { useTranslation } from 'react-i18next'

/**
 * The internal imports
 */
import {
  isFetchBaseQueryError,
  isGraphqlError,
  isErrorWithMessage,
  isErrorWithKey,
} from '@/lib/utils/errorsHelpers'
import type { ErrorMessageComponent } from '@/types'

const ErrorMessage: ErrorMessageComponent = ({ error, errorKey = 'base' }) => {
  const { t } = useTranslation('common')

  const errorMessage = useMemo(() => {
    if (typeof error === 'string') {
      return error
    } else if (isFetchBaseQueryError(error)) {
      return error.data.errors.join()
    } else if (isErrorWithMessage(error)) {
      return error.message
    } else if (isErrorWithKey(error, errorKey)) {
      return error.message[0][errorKey]
    } else if (isGraphqlError(error)) {
      return t('errorBoundary.formError')
    } else if (error) {
      return t('errorBoundary.generalError')
    } else {
      return ''
    }
  }, [error, errorKey])

  return (
    <Text fontSize='m' color='error' data-cy='server_message'>
      {errorMessage}
    </Text>
  )
}

export default ErrorMessage
