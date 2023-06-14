/**
 * The internal imports
 */
import { DescriptionTranslations, LabelTranslations, ProjectId } from './common'

export type Management = LabelTranslations &
  DescriptionTranslations & {
    id: number
    isNeonat: boolean
    isReferral: boolean
    levelOfUrgency: number
    isDefault: boolean
    hasInstances: boolean
    files: MediaType[]
  }

export type ManagementEdge = Pick<
  Management,
  'id' | 'isNeonat' | 'isDefault' | 'hasInstances' | LabelTranslations
>

export type ManagementQuery = ProjectId &
  LabelTranslations &
  DescriptionTranslations & {
    id?: number
    isNeonat: boolean
    isReferral: boolean
    levelOfUrgency: number
    filesToAdd: File[]
    existingFilesToRemove?: number[]
  }

export type ManagementFormComponent = React.FC<
  ProjectId & { managementId?: number }
>

export type ManagementInputs = ProjectId & {
  label?: string
  description?: string
  isNeonat: boolean
  isReferral: boolean
  levelOfUrgency: number
}
