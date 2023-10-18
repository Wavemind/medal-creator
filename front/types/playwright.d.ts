/**
 * The internal imports
 */
import {
  AdminContext,
  ClinicianContext,
  DeploymentManagerContext,
  ProjectAdminContext,
  ViewerContext,
  EmptyContext,
} from '@/tests/contexts'

export type Contexts = {
  adminContext: AdminContext
  projectAdminContext: ProjectAdminContext
  clinicianContext: ClinicianContext
  deploymentManagerContext: DeploymentManagerContext
  viewerContext: ViewerContext
  emptyContext: EmptyContext
}
