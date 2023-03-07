/**
 * The internal imports
 */
import { Role } from '../config/constants'

// TODO: WAIT CONFIRMATION BY UNISANTE
export const isAdminOrClinician = (role: Role): boolean => {
  return [Role.admin, Role.clinician].includes(role)
}
