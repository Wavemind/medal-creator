/**
 * The external imports
 */
import { FetchBaseQueryError } from '@reduxjs/toolkit/query'

export type ApiErrors = FetchBaseQueryError & {
  data: { success: boolean; errors: string[] }
}
