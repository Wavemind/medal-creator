/**
 * The internal imports
 */
import type { GetAvailableNodes } from '@/lib/api/modules'
import type { LabelTranslations } from './common'
import { Scalars } from './graphql'
import type { Unpacked } from './utility'

export type AvailableNode = Unpacked<GetAvailableNodes>

export type InstantiatedNode = AvailableNode & { instanceableId: Scalars['ID'] }

export type DiagramAnswers = LabelTranslations & {
  id: string
}
