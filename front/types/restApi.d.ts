/**
 * The external imports
 */
import type { FetchBaseQueryError } from '@reduxjs/toolkit/query'

export type ApiErrors = FetchBaseQueryError & {
  data: { success: boolean; errors: Record<string, string[]> }
}
