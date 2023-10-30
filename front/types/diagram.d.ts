/**
 * The internal imports
 */
import type { GetAvailableNodes } from '@/lib/api/modules/enhanced/instance.enhanced'
import type { LabelTranslations, PaginationObject } from './common'
import type { ConditionInput, Condition, Scalars } from './graphql'
import type { Unpacked } from './utility'

// TODO : Maybe get this from the back
export enum CutOffValueTypesEnum {
  Days = 'days',
  Months = 'months',
}

export enum DiagramNodeTypeEnum {
  Variable = 'variable',
  Diagnosis = 'diagnosis',
  MedicalCondition = 'medicalCondition',
  Management = 'management',
  Drug = 'drug',
}

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
> & { cutOffValueType: CutOffValueTypesEnum }
