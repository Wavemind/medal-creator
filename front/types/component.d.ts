/**
 * The external imports
 */
import type {
  Dispatch,
  FC,
  PropsWithChildren,
  SetStateAction,
  ReactElement,
} from 'react'
import type { Node } from 'reactflow'
import type { MultiValue, SingleValue } from 'chakra-react-select'
import type { DefaultTFuncReturn } from 'i18next'

/**
 * The internal imports
 */
import { DiagramEnum, Scalars } from './graphql'
import { FormEnvironments } from '@/lib/config/constants'
import type { MediaType } from './node'
import type { ProjectId, Index, IsDisabled } from './common'
import type {
  AvailableNode,
  DiagramAnswers,
  InstantiatedNode,
  CutOffEdgeData,
} from './diagram'
import type { DiagramPage } from './page'
import type { Option } from './input'

export type PageComponent = FC<
  PropsWithChildren<{
    title: string
  }>
>

export type UnavailableComponent = FC<IsDisabled>
export type CategoryComponent = FC<
  IsDisabled & { formEnvironment?: FormEnvironments }
>

export type ComplaintCategoryComponent = FC<ProjectId & { restricted: boolean }>
export type PlaceholderComponent = FC<ProjectId>
export type AdministrationRouteComponent = FC<ProjectId & Index>
export type BreakableComponent = FC<Index>
export type MedicationFormComponent = FC<{ append: Dispatch }>

export type DefaultFormulationComponent = FC<Index>
export type InjectionInstructionsComponent = FC<ProjectId & Index>

export type DiagramTypeComponent = FC<{ diagramType: DiagramEnum }>

export type DiagramWrapperComponent = FC<
  Omit<DiagramPage, 'instanceableId' | 'projectId'> & {
    initialNodes: Node<InstantiatedNode>[]
    initialEdges: Edge[]
  }
>
export type AvailableNodeComponent = FC<{ node: AvailableNode }>
export type DiagramNodeComponent = FC<{
  data: AvailableNode
  fromAvailableNode?: boolean
}>
export type DiagramNodeAnswersComponent = FC<{
  bg: string
  answers: DiagramAnswers[]
}>

export type NodeHeaderComponent = FC<{
  mainColor: string
  icon: ReactElement | undefined
  category: string
  textColor: string
  isOpen: boolean
  onOpen: () => void
  onClose: () => void
  isNeonat: boolean
  fromAvailableNode: boolean
}>

export type NodeHeaderMenuComponent = FC<{
  textColor: string
  isOpen: boolean
  onOpen: () => void
  onClose: () => void
}>

export type NodeWrapperComponent = FC<{
  mainColor: string
  headerTitle: string | undefined
  headerIcon?: ReactElement
  children: ReactElement
  textColor: string
  isNeonat?: boolean
  fromAvailableNode: boolean
}>

export type AnswerTypeComponent = FC<IsDisabled>

export type MediaComponent = FC<{
  filesToAdd: File[]
  existingFiles: MediaType[]
  setFilesToAdd: Dispatch<SetStateAction<File[]>>
  existingFilesToRemove: number[]
  setExistingFilesToRemove: Dispatch<SetStateAction<number[]>>
}>

export type ConditionFormComponent = FC<{
  conditionId: Scalars['ID']
  close: () => void
  callback: (data: CutOffEdgeData) => void
}>

export type ExcludedNodesComponent = FC<
  ProjectId & {
    nodeId: Scalars['ID']
    nodeType: 'drug' | 'management'
    nodeQuery: any
    lazyNodesQuery: any
  }
>

export type ExcludedNodeComponent = FC<
  ProjectId &
    Index & {
      exclusion: Option | null
      setNewExclusions: React.Dispatch<React.SetStateAction<(Option | null)[]>>
      nodeType: 'drug' | 'management'
      lazyNodesQuery: any
    }
>

export type DiagramButtonComponent = FC<{
  href: string
  label: DefaultTFuncReturn
}>

export type UserMenuComponent = FC<{ short?: boolean }>
