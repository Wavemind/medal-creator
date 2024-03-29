/**
 * The external imports
 */

import type { MultiValue, SingleValue } from 'chakra-react-select'
import type {
  FC,
  ChangeEvent,
  SetStateAction,
  Dispatch,
  RefObject,
  PropsWithChildren,
} from 'react'

/**
 * The internal imports
 */
import { DiagramEnum } from '@/types'
import type { Option, UpdatableNodeValues, IsRestricted } from '@/types'
import type { CreateDiagnosis } from '@/lib/api/modules/enhanced/diagnosis.enhanced'

export type FilterKey = 'selectedCategories' | 'selectedIsNeonat' | 'searchTerm'

export type UpdateFilterData<Key extends FilterKey> =
  Key extends 'selectedCategories'
    ? MultiValue<Option>
    : Key extends 'selectedIsNeonat'
    ? SingleValue<Option>
    : Key extends 'searchTerm'
    ? string
    : string

export type FilterState = {
  searchTerm: string
  selectedIsNeonat: SingleValue<Option>
  selectedCategories: MultiValue<Option>
}

type PaginationFilterContextType<DataType> = {
  filterState: FilterState
  updateFilter: <KeyToUpdate extends FilterKey>(
    key: KeyToUpdate,
    data: UpdateFilterData<KeyToUpdate>
  ) => void
  resetFilter: () => void
  updateSearch: (e: ChangeEvent<HTMLInputElement>) => void
  resetSearch: () => void
  data: DataType[]
  setData: Dispatch<SetStateAction<DataType[]>>
  after: string
  setAfter: Dispatch<SetStateAction<string>>
  currentPage: number
  setCurrentPage: Dispatch<SetStateAction<number>>
}

export type AutocompleteProps = Array<{ label: string; value: string }>

export type FormulaContextType = {
  inputRef: RefObject<HTMLInputElement>
  inputValue: string
  autocompleteOptions: AutocompleteProps
  setAutocompleteOptions: Dispatch<SetStateAction<AutocompleteProps>>
  setInputValue: Dispatch<SetStateAction<string>>
  handleMenuItemClick: Dispatch<string>
  searchElement: string
}

export type ProjectContextType = {
  name: string
  projectLanguage: string
  isCurrentUserAdmin: boolean
  isAdminOrClinician: boolean
}

export type WebSocketMessage = { message: string; elapsed_time: number }
export type WebSocketMessages = Array<WebSocketMessage>

export type WebSocketContextType = {
  isReceiving: boolean
  setIsReceiving: Dispatch<SetStateAction<boolean>>
  isSuccess: boolean
  isError: boolean
  messages: WebSocketMessages
  message: string
  elementId: string | null
  error: string
}

export type PaginationFilterProviderProps = {
  children: React.ReactNode
}

export type DefaultProviderProps = {
  children: React.ReactNode
}

export type DiagramContextType = {
  addDiagnosisToDiagram: Dispatch<CreateDiagnosis>
  generateInstance: (props: DefaultInstanceProps) => Promise<CreateInstance>
  addVariableToDiagram: Dispatch<UpdatableNodeValues>
  addNodeInDiagram: Dispatch<UpdatableNodeValues, string>
  diagramType: DiagramEnum
  convertedInstanceableId?: string
  setRefetchNodes: Dispatch<SetStateAction<boolean>>
  refetchNodes: boolean
  isEditable: boolean
}

export type DefaultInstanceProps = {
  nodeId: string
  positionX?: number
  positionY?: number
}

export type DiagramProviderProps = FC<
  PropsWithChildren &
    IsRestricted & {
      diagramType: DiagramEnum
    }
>
