/**
 * The external imports
 */
import type { Dispatch, FC, PropsWithChildren, SetStateAction } from 'react'
import type { MediaType } from './node'
import type { ProjectId } from './common'

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
