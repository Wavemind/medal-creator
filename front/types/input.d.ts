/**
 * The external imports
 */
import type { FC, SetStateAction, Dispatch } from 'react'
import type { Accept } from 'react-dropzone'
import type { DefaultTFuncReturn } from 'i18next'

/**
 * The internal imports
 */
import type { CustomPartial } from './common'
import type { UserProject } from './userProject'
import type { AllowedUser } from './user'
import type { MediaType } from './node'

export type BaseInputProps = {
  name: string
  label: DefaultTFuncReturn
  isRequired?: boolean
}

export type CheckBoxOption = {
  [key: string]: string | number
}

export type InputProps = FC<
  BaseInputProps & {
    type?: string
    helperText?: DefaultTFuncReturn
  }
>

export type NumberInputProps = FC<
  BaseInputProps & {
    min?: number
    max?: number
  }
>

export type AddProjectsToUserProps = FC<{
  userProjects: CustomPartial<UserProject, 'projectId'>[]
  setUserProjects: Dispatch<
    SetStateAction<CustomPartial<UserProject, 'projectId'>[]>
  >
}>

export type AddUsersToProjectProps = FC<{
  allowedUsers: AllowedUser[]
  setAllowedUsers: Dispatch<SetStateAction<AllowedUser[]>>
}>

export type CheckBoxGroupProps = FC<
  BaseInputProps & {
    options: CheckBoxOption[]
    disabledOptions?: (string | number)[]
    labelOption?: string
    valueOption?: keyof CheckBoxOption
  }
>

export type DropzoneProps = FC<
  BaseInputProps & {
    multiple: boolean
    acceptedFileTypes: Accept
    filesToAdd: File[]
    setFilesToAdd: Dispatch<SetStateAction<File[]>>
    existingFiles: MediaType[]
    setExistingFilesToRemove: Dispatch<SetStateAction<number[]>>
    existingFilesToRemove: number[]
  }
>

export type FileUploadProps = FC<
  BaseInputProps & {
    hint: string
    acceptedFileTypes: string
  }
>

export type PinProps = FC<{
  onComplete: (value: string) => void
}>
