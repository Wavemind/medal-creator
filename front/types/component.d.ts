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

/**
 * The internal imports
 */
import type { MediaType } from './node'
import { DiagramType } from './config/constants'
import type { ProjectId } from './common'
import type { AvailableNode, DiagramAnswers } from './diagram'

export type PageComponent = FC<
  PropsWithChildren<{
    title: string
  }>
>

export type UnavailableComponent = FC<{ isDisabled: boolean }>
export type CategoryComponent = FC<{ isDisabled: boolean }>

export type ComplaintCategoryComponent = FC<ProjectId>
export type PlaceholderComponent = FC<ProjectId>
export type AdministrationRouteComponent = FC<ProjectId & { index: number }>
export type BreakableComponent = FC<{ index: number }>
export type MedicationFormComponent = FC<{ append: Dispatch }>

export type DefaultFormulationComponent = FC<{ index: number }>
export type InjectionInstructionsComponent = FC<ProjectId & { index: number }>

export type DiagramSideBarComponent = FC<{ diagramType: DiagramType }>
export type DiagramWrapperComponent = FC<{
  diagramType: DiagramType
  initialNodes: Node<AvailableNode>[]
}>
export type AvailableNodeComponent = FC<{ node: AvailableNode }>
export type DiagramNodeComponent = FC<{ data: AvailableNode }>
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
}>

export type AnswerTypeComponent = FC<{
  isDisabled: boolean
}>

export type MediaComponent = FC<{
  filesToAdd: File[]
  existingFiles: MediaType[]
  setFilesToAdd: Dispatch<SetStateAction<File[]>>
  existingFilesToRemove: number[]
  setExistingFilesToRemove: Dispatch<SetStateAction<number[]>>
}>
