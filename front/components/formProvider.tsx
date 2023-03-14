/**
 * The external imports
 */
import { ReactNode, useEffect } from 'react'
import { capitalize } from 'lodash'
import {
  FieldValues,
  FormProvider as RHFFormProvider,
  Path,
  UseFormReturn,
} from 'react-hook-form'
import { ClientError } from 'graphql-request'
import { SerializedError } from '@reduxjs/toolkit'
import { isGraphqlError } from '@/lib/utils'

type FormProviderProps<T extends FieldValues> = {
  methods: UseFormReturn<T, unknown>
  isError: boolean
  error:
    | ClientError
    | {
        message: { [key: string]: string }
      }
    | SerializedError
    | undefined
  children: ReactNode
}

const FormProvider = <T extends FieldValues>({
  methods,
  isError,
  error,
  children,
}: FormProviderProps<T>) => {
  useEffect(() => {
    if (isError && isGraphqlError(error)) {
      const { message } = error

      Object.keys(message).forEach(key => {
        methods.setError(key as Path<T>, {
          message: capitalize(message[key]),
        })
      })
    }
  }, [isError, error])

  return <RHFFormProvider {...methods}>{children}</RHFFormProvider>
}

export default FormProvider
