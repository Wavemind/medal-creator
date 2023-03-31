/**
 * The external imports
 */
import type { ReactNode, FC, SetStateAction, Dispatch } from 'react'
import type { Accept } from 'react-dropzone'
import type { DefaultTFuncReturn } from 'i18next'
import type { ClientError } from 'graphql-request'
import type { SerializedError } from '@reduxjs/toolkit'
import type { UseFormReturn } from 'react-hook-form'

/**
 * The internal imports
 */
import type { CustomPartial, PaginatedWithTranslations } from './common'
import type { UserProject } from './userProject'
import type { AllowedUser } from './user'
import type { MediaType } from './node'

export type BaseInputProps = {
  name: string
  label: DefaultTFuncReturn
  isRequired?: boolean
}

export type Option = {
  [key: string]: string | number
}

export type InputComponent = FC<
  BaseInputProps & {
    type?: string
    helperText?: DefaultTFuncReturn
  }
>

export type GenericInputComponent = FC<BaseInputProps>

export type NumberInputComponent = FC<
  BaseInputProps & {
    min?: number
    max?: number
  }
>

export type AddProjectsToUserComponent = FC<{
  userProjects: CustomPartial<UserProject, 'projectId'>[]
  setUserProjects: Dispatch<
    SetStateAction<CustomPartial<UserProject, 'projectId'>[]>
  >
}>

export type AddUsersToProjectComponent = FC<{
  allowedUsers: AllowedUser[]
  setAllowedUsers: Dispatch<SetStateAction<AllowedUser[]>>
}>

export type CheckBoxGroupComponent = FC<
  BaseInputProps & {
    options: Option[]
    disabledOptions?: (string | number)[]
    labelOption?: string
    valueOption?: keyof Option
  }
>

export type DropzoneComponent = FC<
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

export type FileUploadComponent = FC<
  BaseInputProps & {
    hint: string
    acceptedFileTypes: string
  }
>

export type PinComponent = FC<{
  onComplete: (value: string) => void
}>

export type SelectComponent = FC<
  BaseInputProps & {
    options: Option[] | PaginatedWithTranslations
    labelOption?: string
    valueOption?: string
  }
>

export type SliderComponent = FC<{
  name: string
  label: string
  helperText?: DefaultTFuncReturn
  isDisabled?: boolean
}>

export type TextAreaComponent = FC<
  BaseInputProps & {
    helperText?: DefaultTFuncReturn
  }
>

export type FormProviderComponents<T extends FieldValues> = {
  methods: UseFormReturn<T, unknown>
  isError: boolean
  error:
    | ClientError
    | {
        message: { [key: string]: string }
      }
    | SerializedError
    | undefined
  children: ReactNode
}
