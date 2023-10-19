/**
 * The internal imports
 */
import { BaseContext } from '@/tests/contexts/baseContext'

// Context for the "admin" role.
export class AdminContext extends BaseContext {}

// Context for the "project admin" role.
export class ProjectAdminContext extends BaseContext {}

// Context for the "clinician" role.
export class ClinicianContext extends BaseContext {}

// Context for the "deployment manager" role.
export class DeploymentManagerContext extends BaseContext {}

// Context for the "viewer" role.
export class ViewerContext extends BaseContext {}

// Context without a role to test authentication
export class EmptyContext extends BaseContext {}
