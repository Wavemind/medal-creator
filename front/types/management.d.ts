/**
 * The internal imports
 */
import { ManagementInput, Scalars } from './graphql'

export type ManagementFormComponent = React.FC<{ managementId?: Scalars['ID'] }>

export type ManagementInputs = Omit<
  ManagementInput,
  'id' | 'labelTranslations' | 'descriptionTranslations'
> & {
  label?: string
  description?: string
}
