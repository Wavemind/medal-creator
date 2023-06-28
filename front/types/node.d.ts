/**
 * The internal imports
 */
import { FileExtensionsAuthorized, DiagramType } from '@/lib/config/constants'
import type { LabelTranslations } from './common'

export type MediaType = {
  id: number
  name: string
  url: string
  size: number
  extension: FileExtensionsAuthorized
}

export type ComplaintCategory = LabelTranslations & {
  id: number
}

export type FlattenComplaintCategory = {
  id: number
  [key: string]: string
}

export type AvailableNodeInput = {
  instanceableId: string
  instanceableType: DiagramType
  searchTerm: string
}
