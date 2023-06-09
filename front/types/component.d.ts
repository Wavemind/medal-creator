/**
 * The external imports
 */
import type { FC, PropsWithChildren } from 'react'
import type { MediaType } from './node'
import { ProjectId } from './common'

export type PageComponent = FC<
  PropsWithChildren<{
    title: string
  }>
>

export type UnavailableComponent = FC<{ isDisabled: boolean }>
export type CategoryComponent = FC<{ isDisabled: boolean }>

export type ComplaintCategoryComponent = FC<ProjectId>
export type PlaceholderComponent = FC<ProjectId>

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
