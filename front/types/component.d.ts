/**
 * The external imports
 */
import type { FC, PropsWithChildren } from 'react'

export type PageComponent = FC<
  PropsWithChildren<{
    title: string
  }>
>

export type MediaComponent = FC<{
  filesToAdd: File[]
  setFilesToAdd: Dispatch<SetStateAction<File[]>>
  existingFilesToRemove: number[]
  setExistingFilesToRemove: Dispatch<SetStateAction<number[]>>
}>
