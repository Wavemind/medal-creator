/**
 * The internal imports
 */
import { DescriptionTranslations, LabelTranslations, ProjectId } from './common'
import { Scalars } from './graphql'

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
  ProjectId & { managementId?: Scalars['ID'] }
>

export type ManagementInputs = ProjectId & {
  label?: string
  description?: string
  isNeonat: boolean
  isReferral: boolean
  levelOfUrgency: number
}
