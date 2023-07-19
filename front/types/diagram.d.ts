/**
 * The internal imports
 */
import type { GetAvailableNodes } from '@/lib/api/modules'
import type { LabelTranslations } from './common'
import type { Scalars } from './graphql'
import type { Unpacked } from './utility'

export type AvailableNode = Unpacked<GetAvailableNodes>

export type InstantiatedNode = AvailableNode & { instanceId: Scalars['ID'] }

// TODO REMPLACE WITH TYPE FROM GRAPHQL
export type DiagramAnswers = LabelTranslations & {
  id: Scalars['ID']
}
