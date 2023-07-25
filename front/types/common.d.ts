/**
 * The external imports
 */
import type { IconProps as ChakraIconProps } from '@chakra-ui/react'

/**
 * The internal imports
 */
import type { Unpacked } from './utility'

/**
 * The internal imports
 */
import type { Scalars, PageInfo, Hstore } from './graphql'

export type Paginated<Model> = {
  pageInfo: PageInfo
  totalCount: number
  edges: { node: { id: Scalars['ID'] } & Model }[]
}

export type Languages = Omit<
  Hstore,
  'id' | '__typename' | 'createdAt' | 'updatedAt'
>

export type MenuOptionsList = 'account' | 'algorithm' | 'library'

export type MenuOptions = {
  [key in MenuOptionsList]: {
    label: string
    path: (props: Record<string, string>) => string
    key: string
  }[]
}

export type Index = {
  index: number
}

export type IsAdmin = {
  isAdmin: boolean
}

export type IsDisabled = {
  isDisabled: boolean
}

export type IsAdminOrClinician = {
  isAdminOrClinician: boolean
}

export type LabelTranslations = {
  labelTranslations: Languages
}

export type DescriptionTranslations = {
  descriptionTranslations: Languages
}

export type UserId = {
  userId: Scalars['ID']
}

export type ProjectId = {
  projectId: Scalars['ID']
}

export type AlgorithmId = {
  algorithmId: Scalars['ID']
}

export type DiagnosisId = {
  diagnosisId: Scalars['ID']
}

export type DecisionTreeId = {
  decisionTreeId: Scalars['ID']
}

export type VariableId = {
  variableId: Scalars['ID']
}

export type IconProps = JSX.IntrinsicAttributes & ChakraIconProps

export type StepperSteps = {
  label: DefaultTFuncReturn
  description?: DefaultTFuncReturn
  content: JSX.Element
}

export type PaginationObject<T> = Unpacked<T['edges']>['node']
