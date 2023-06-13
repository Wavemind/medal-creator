/**
 * The internal imports
 */
import { LabelTranslations, ProjectId } from './common'

export type Management = LabelTranslations & {
  id: number
  isNeonat: boolean
  hasInstances: boolean
  isDefault: boolean
}

export type ManagementFormComponent = React.FC<ProjectId>

export type ManagementInputs = ProjectId & {
  label: string
  description: string
  isNeonat: boolean
  isReferral: boolean
  levelOfUrgency: number
}
