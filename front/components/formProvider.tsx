/**
 * The external imports
 */
import { useEffect } from 'react'
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
import { isGraphqlError } from '@/lib/utils/errorsHelpers'
import { FormProviderComponents } from '@/types'

const FormProvider = <T extends FieldValues>({
  methods,
  isError,
  error,
  children,
}: FormProviderComponents<T>) => {
  useEffect(() => {
    if (isError && isGraphqlError(error)) {
      const { message } = error

      Object.keys(message).forEach(key => {
        methods.setError(camelCase(key) as Path<T>, {
          message: capitalize(message[key]),
        })
      })
    }
  }, [isError])

  return <RHFFormProvider {...methods}>{children}</RHFFormProvider>
}

export default FormProvider
