/**
 * The external imports
 */
import type { FC } from 'react'
import type { FallbackProps } from 'react-error-boundary'
import type { SerializedError } from '@reduxjs/toolkit'
import type { FetchBaseQueryError } from '@reduxjs/toolkit/dist/query'

export type ComponentStackProps = {
  componentStack: string
} | null

export type AppErrorFallbackComponent = FC<
  FallbackProps & { errorInfo: ComponentStackProps }
>

export type ErrorMessageComponent = FC<{
  error: SerializedError | FetchBaseQueryError | unknown
}>
