/**
 * The external imports
 */
import { ReactNode, useEffect } from 'react'
import { capitalize } from 'lodash'
import {
  FieldValues,
  FormProvider as RHFFormProvider,
  UseFormReturn,
} from 'react-hook-form'

type FormProviderProps<T extends FieldValues> = {
  methods: UseFormReturn<T, unknown>
  isError: boolean
  error: { message: { [key: string]: string } } | undefined
  children: ReactNode
}

const FormProvider = <T extends FieldValues>({
  methods,
  isError,
  error,
  children,
}: FormProviderProps<T>) => {
  useEffect(() => {
    if (isError && error) {
      const { message } = error

      Object.keys(message).forEach(key => {
        methods.setError(key, {
          message: capitalize(message[key]),
        })
      })
    }
  }, [isError])

  return <RHFFormProvider {...methods}>{children}</RHFFormProvider>
}

export default FormProvider
