/**
 * The external imports
 */
import { ApiErrors } from '@/types'

/**
 * Type predicate to narrow an unknown error to `FetchBaseQueryError`
 */
export function isFetchBaseQueryError(error: unknown): error is ApiErrors {
  return (
    typeof error === 'object' &&
    error !== null &&
    Object.keys(error).includes('status')
  )
}

/**
 * Type predicate to narrow an unknown error to an object with a string 'message' property
 */
export function isErrorWithMessage(
  error: unknown
): error is { message: string } {
  return (
    typeof error === 'object' &&
    error !== null &&
    'message' in error &&
    typeof error.message === 'string'
  )
}

/**
 * Type predicate to narrow an unknown error to a graphql error
 */
export const isGraphqlError = (
  error: unknown
): error is { message: { [key: string]: string } } => {
  return (
    typeof error === 'object' &&
    error !== null &&
    'message' in error &&
    typeof error.message === 'object' &&
    error.message !== null
  )
}
