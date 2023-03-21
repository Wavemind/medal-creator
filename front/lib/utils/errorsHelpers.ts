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
export function isGraphqlError(
  error: unknown
): error is { message: { [key: string]: string } } {
  return (
    typeof error === 'object' &&
    error !== null &&
    'message' in error &&
    typeof error.message === 'object' &&
    error.message !== null
  )
}

/**
 * Type predicate to narrow an unknown error to an array with a JSON 'message' property
 */
export function isErrorWithJSON(
  error: unknown
): error is { message: string }[] {
  if (
    Array.isArray(error) &&
    error.length > 0 &&
    'message' in error[0] &&
    typeof error[0].message === 'string'
  ) {
    return isJSON(error[0].message)
  } else {
    return false
  }
}

export function isJSON(str: string): boolean {
  try {
    const obj = JSON.parse(str)
    return typeof obj === 'object' && obj !== null
  } catch (e) {
    return false
  }
}
