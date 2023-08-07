/**
 * The internal imports
 */
import type { GetAvailableNodes } from '@/lib/api/modules'
import type { LabelTranslations, PaginationObject } from './common'
import type { ConditionInput, Condition, Scalars } from './graphql'
import type { Unpacked } from './utility'
import type { MultiValue, SingleValue } from 'chakra-react-select'

export type AvailableNode = PaginationObject<Unpacked<GetAvailableNodes>>

export type InstantiatedNode = AvailableNode & { instanceId: Scalars['ID'] }

export type CutOffEdgeData = Pick<Condition, 'cutOffStart' | 'cutOffEnd'>

// TODO REMPLACE WITH TYPE FROM GRAPHQL
export type DiagramAnswers = LabelTranslations & {
  id: Scalars['ID']
}

export type ConditionInputs = Pick<
  ConditionInput,
  'cutOffStart' | 'cutOffEnd'
> & { cutOffValueType: 'days' | 'months' }

type SingleValue<T> = {
  value: T
  label: string
}
