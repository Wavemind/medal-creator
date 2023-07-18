/**
 * The external imports
 */
import type { TFunction } from 'i18next'

/**
 * The internal imports
 */
import type { TableState } from './datatable'
import type { IconProps as ChakraIconProps } from '@chakra-ui/react'

export type Paginated<Model> = {
  pageInfo: {
    hasNextPage: boolean
    hasPreviousPage: boolean
    endCursor: string
    startCursor: string
  }
  totalCount: number
  edges: { node: { id: number } & Model }[]
}

export type CustomPartial<
  InputPartial,
  Model extends keyof key
> = Partial<InputPartial> & Pick<key, Model>

export type PathProps = {
  [key: string]: string | string[] | undefined
}

export type MenuOptionsList = 'account' | 'algorithm' | 'library'

export type MenuOptions = {
  [key in MenuOptionsList]: {
    label: string
    path: (props: PathProps) => string
    key: string
  }[]
}

// TODO: NEED BETTER IMPLEMENTATION
export type PaginatedQueryWithProject = Partial<TableState> & {
  projectId?: number | null
  algorithmId?: number | null
}

export type LabelTranslations = {
  labelTranslations: StringIndexType
}

export type DescriptionTranslations = {
  descriptionTranslations: StringIndexType
}

export type PaginatedWithTranslations = Paginated<LabelTranslations>

export type StringIndexType = {
  [key: string]: string
}

export type UserId = {
  userId: number
}

export type DiagnosisId = {
  diagnosisId: number
}

export type IsAdmin = {
  isAdmin: boolean
}

export type IsAdminOrClinician = {
  isAdminOrClinician: boolean
}

export type ProjectId = {
  projectId: number
}

export type AlgorithmId = {
  algorithmId: number
}

export type IconProps = JSX.IntrinsicAttributes & ChakraIconProps

export type StepperSteps = {
  label: DefaultTFuncReturn
  description?: DefaultTFuncReturn
  content: JSX.Element
}

export type CustomTFunction<N> = TFunction<N, undefined, N>
