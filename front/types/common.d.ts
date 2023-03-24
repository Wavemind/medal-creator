/**
 * The internal imports
 */
import type { TableState } from './datatable'
import type { IconProps as ChakraIconProps } from '@chakra-ui/react'

export type Paginated<T> = {
  pageInfo: {
    hasNextPage: boolean
    hasPreviousPage: boolean
    endCursor: string
    startCursor: string
  }
  totalCount: number
  edges: { node: { id: number } & T }[]
}

export type CustomPartial<
  InputPartial,
  Model extends keyof key
> = Partial<InputPartial> & Pick<key, Model>

export type PathProps = {
  [key: string]: string | string[] | undefined
}

export type MenuOptions = {
  [key: string]: {
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

export type isAdmin = {
  isAdmin: boolean
}

export type projectId = {
  projectId: number
}

export type algorithmId = {
  algorithmId: number
}

export type IconProps = JSX.IntrinsicAttributes & ChakraIconProps
