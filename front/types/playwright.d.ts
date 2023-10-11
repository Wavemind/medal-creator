/**
 * The internal imports
 */
import {
  AdminContext,
  ClinicianContext,
  DeploymentManagerContext,
  ProjectAdminContext,
  ViewerContext,
} from '@/playwright/contexts'

export type Contexts = {
  adminContext: AdminContext
  projectAdminContext: ProjectAdminContext
  clinicianContext: ClinicianContext
  deploymentManagerContext: DeploymentManagerContext
  viewerContext: ViewerContext
}
