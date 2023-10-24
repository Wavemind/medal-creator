/**
 * The internal imports
 */
import { RoleEnum } from '@/types'

// TODO: WAIT CONFIRMATION BY UNISANTE
export const isAdminOrClinician = (role: RoleEnum): boolean => {
  return [RoleEnum.Admin, RoleEnum.Clinician].includes(role)
}
