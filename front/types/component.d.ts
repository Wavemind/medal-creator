/**
 * The external imports
 */
import type { FC, PropsWithChildren } from 'react'
import type { MediaType } from './node'

export type PageComponent = FC<
  PropsWithChildren<{
    title: string
  }>
>

export type MediaComponent = FC<{
  filesToAdd: File[]
  existingFiles: MediaType[]
  setFilesToAdd: Dispatch<SetStateAction<File[]>>
  existingFilesToRemove: number[]
  setExistingFilesToRemove: Dispatch<SetStateAction<number[]>>
}>
