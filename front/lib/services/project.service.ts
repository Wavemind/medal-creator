/**
 * The external imports
 */
import * as yup from 'yup'

/**
 * The internal imports
 */
import type { CustomTFunction, ProjectInputs } from '@/types'
import { EditProject } from '@/lib/api/modules/enhanced/project.enhanced'

class Project {
  private static instance: Project

  public static getInstance(): Project {
    if (!Project.instance) {
      Project.instance = new Project()
    }

    return Project.instance
  }

  public buildFormData = (project: EditProject) => {
    return {
      name: project.name,
      description: project.description || '',
      consentManagement: project.consentManagement,
      trackReferral: project.trackReferral,
      languageId: project.language.id,
    }
  }

  /**
   * Returns a Yup validation schema for the project object.
   * @param t translation function
   * @returns yupSchema
   */
  public getValidationSchema(
    t: CustomTFunction<'project'>
  ): yup.ObjectSchema<
    Omit<
      ProjectInputs,
      | 'emergencyContentTranslations'
      | 'emergencyContentVersion'
      | 'studyDescriptionTranslations'
      | 'userProjectsAttributes'
    >
  > {
    return yup.object({
      name: yup.string().label(t('form.name')).required(),
      consentManagement: yup.boolean().label(t('form.consentManagement')),
      trackReferral: yup.boolean().label(t('form.trackReferral')),
      description: yup.string().label(t('form.description')),
      villages: yup
        .mixed<File>()
        .nullable()
        .test('is-json', t('onlyJSON', { ns: 'validations' }), value => {
          if (!value) {
            return true // Allow empty value (no file selected)
          }
          return value.type === 'application/json'
        }),
      languageId: yup.string().label(t('form.languageId')).required(),
    })
  }
}

export default Project.getInstance()
