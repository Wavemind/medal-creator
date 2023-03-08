/**
 * The internal imports
 */
import { FileExtensionsAuthorized } from '@/lib/config/constants'
import type { LabelTranslations } from './common'

export type MediaType = {
  id: number
  name: string
  url: string
  extension: FileExtensionsAuthorized
}

export type ComplaintCategory = LabelTranslations & {
  id: number
}

export type FlattenComplaintCategory = {
  id: number
  [key: string]: string
}
