/**
 * The external imports
 */
import type {
  FC,
  SetStateAction,
  Dispatch,
  PropsWithChildren,
  ReactElement,
} from 'react'
import type { Accept } from 'react-dropzone'
import type { DefaultTFuncReturn } from 'i18next'
import type { ClientError } from 'graphql-request'
import type { SerializedError } from '@reduxjs/toolkit'
import type { UseFormReturn } from 'react-hook-form'
import type { NumberInputProps } from '@chakra-ui/react'

/**
 * The internal imports
 */
import type { CustomPartial } from './common'
import type { UserProject } from './userProject'
import type { AllowedUser } from './user'
import type { MediaType } from './node'
import type { ApiErrors } from './restApi'

export type BaseInputProps = {
  name: string
  label?: DefaultTFuncReturn
  isRequired?: boolean
  isDisabled?: boolean
}

export type Option = {
  [key: string]: string
}

export type InputComponent = FC<
  BaseInputProps & {
    type?: string
    helperText?: DefaultTFuncReturn
    hasDrawer?: boolean
    drawerContent?: ReactElement
    drawerTitle?: DefaultTFuncReturn
  }
>

export type GenericInputComponent = FC<BaseInputProps>

export type NumberComponent = FC<BaseInputProps & NumberInputProps>

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
    options: Option[]
    labelOption?: string
    valueOption?: string
  }
>

export type SliderComponent = FC<
  BaseInputProps & {
    helperText?: DefaultTFuncReturn
    isDisabled?: boolean
  }
>

export type TextAreaComponent = FC<
  BaseInputProps & {
    helperText?: DefaultTFuncReturn
  }
>

export type AutocompleteComponent = FC<
  BaseInputProps & {
    subLabel?: ReactElement
    placeholder?: DefaultTFuncReturn
    isMulti?: boolean
    options: Option[]
  }
>

export type FormProviderComponents<T extends FieldValues> = PropsWithChildren<{
  methods: UseFormReturn<T, unknown>
  isError: boolean
  error:
    | ClientError
    | {
        message: Record<string, string>
      }
    | ApiErrors
    | SerializedError
    | undefined
  isSuccess?: boolean
  callbackAfterSuccess?: () => void
}>

export type MessageRangeComponent = FC<ProjectId>

export type SearchComponent = FC<{
  updateSearchTerm: (e: ChangeEvent<HTMLInputElement>) => void
  resetSearchTerm: () => void
  placeholder?: string
}>
