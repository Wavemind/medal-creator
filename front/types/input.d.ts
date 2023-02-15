/**
 * The internal imports
 */
import type { Element } from "./common"

export type BaseInputProps = {
  name: string
  label: DefaultTFuncReturn
  isRequired?: boolean
}

export type MultiSelectWithAdminProps = {
  type: string
  selectedElements: Element[]
  setSelectedElements: React.Dispatch<React.SetStateAction<Element[]>>
  inputLabel: string
  inputPlaceholder: string
  // TODO : This returns any... Check if this what we want
  apiQuery: ReturnType<typeof type>
  selectedText: string
  cardContent: (el: Element) => ReactElement
  noneSelectedText: string
  showAllElementsByDefault?: boolean
}
