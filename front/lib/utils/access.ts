/**
 * The internal imports
 */
import { Role } from '@/lib/config/constants'

// TODO: WAIT CONFIRMATION BY UNISANTE
export const isAdminOrClinician = (role: Role): boolean => {
  return [Role.Admin, Role.Clinician].includes(role)
}
