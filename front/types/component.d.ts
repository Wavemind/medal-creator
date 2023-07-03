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

/**
 * The internal imports
 */
import { DiagramTypeEnum } from '@/lib/config/constants'
import type { MediaType } from './node'
import type { ProjectId } from './common'
import type { AvailableNode, DiagramAnswers } from './diagram'
import type { DiagramPage } from './page'

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

export type DiagramSideBarComponent = FC<{ diagramType: DiagramTypeEnum }>

export type DiagramWrapperComponent = FC<Omit<DiagramPage, 'instanceableId'>>
export type AvailableNodeComponent = FC<{ node: AvailableNode }>
export type DiagramNodeComponent = FC<{
  data: AvailableNode
  fromAvailableNode: boolean
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
