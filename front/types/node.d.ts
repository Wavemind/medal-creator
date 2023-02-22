import type { LabelTranslations } from './common'

export type ComplaintCategory = LabelTranslations & {
  id: number
}

export type FlattenComplaintCategory = {
  id: number
  [key: string]: string
}
