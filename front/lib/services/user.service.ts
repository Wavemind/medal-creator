/**
 * The external imports
 */
import * as yup from 'yup'

/**
 * The internal imports
 */
import {
  type UserInputs,
  type CustomTFunction,
  RoleEnum,
  UserProject,
  CustomPartial,
} from '@/types'
import type { GetUser } from '@/lib/api/modules/enhanced/user.enhanced'

class User {
  private static instance: User

  public static getInstance(): User {
    if (!User.instance) {
      User.instance = new User()
    }

    return User.instance
  }

  public buildFormData = (user: GetUser, role: RoleEnum): UserInputs => {
    return {
      firstName: user.firstName,
      lastName: user.lastName,
      email: user.email,
      role,
    }
  }

  public cleanUserProjects = (
    user: GetUser,
    userProjects: CustomPartial<UserProject, 'projectId'>[]
  ): Array<Partial<UserProject>> => {
    const cleanedUserProjects: Array<Partial<UserProject>> =
      user.userProjects.map(previousUserProject => {
        const foundUserProject = userProjects.find(
          userProject => userProject.id === previousUserProject.id
        )
        if (!foundUserProject) {
          // Existing but removed
          return {
            id: previousUserProject.id,
            projectId: previousUserProject.projectId,
            isAdmin: previousUserProject.isAdmin,
            _destroy: true,
          }
        }
        // Existing and no change
        return {
          id: previousUserProject.id,
          projectId: previousUserProject.projectId,
          isAdmin: foundUserProject.isAdmin,
        }
      })

    userProjects.forEach(userProject => {
      const foundUserProject = cleanedUserProjects.find(
        cleanedUserProject => cleanedUserProject.id === userProject.id
      )
      if (!foundUserProject) {
        cleanedUserProjects.push({
          projectId: userProject.projectId,
          isAdmin: userProject.isAdmin,
        })
      }
    })

    return cleanedUserProjects
  }

  /**
   * Returns a Yup validation schema for the User object.
   * @param t translation function
   * @returns yupSchema
   */
  // TODO : Validation for languageIds ?
  public getValidationSchema(
    t: CustomTFunction<'Users'>
  ): yup.ObjectSchema<UserInputs> {
    return yup.object({
      firstName: yup.string().label(t('firstName')).required(),
      lastName: yup.string().label(t('lastName')).required(),
      email: yup.string().label(t('email')).required().email(),
      role: yup
        .string()
        .oneOf(Object.values(RoleEnum))
        .label(t('role'))
        .required(),
    })
  }
}

export default User.getInstance()
