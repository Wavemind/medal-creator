/**
 * The external imports
 */
import { useTranslation } from 'next-i18next'
import { useFormContext } from 'react-hook-form'

/**
 * The internal imports
 */
import { Textarea } from '@/components'
import { INJECTION_ADMINISTRATION_ROUTES } from '@/lib/config/constants'
import { useGetProjectQuery } from '@/lib/api/modules'
import type { InjectionInstructionsComponent } from '@/types'

const InjectionInstructions: InjectionInstructionsComponent = ({
  index,
  projectId,
}) => {
  const { t } = useTranslation('formulations')
  const { watch } = useFormContext()

  const { data: project, isSuccess: isGetProjectSuccess } =
    useGetProjectQuery(projectId)

  const watchAdministrationRoute = watch(
    `formulationsAttributes[${index}].administrationRouteId`
  )

  if (
    INJECTION_ADMINISTRATION_ROUTES.includes(
      parseInt(watchAdministrationRoute)
    ) &&
    isGetProjectSuccess
  ) {
    return (
      <Textarea
        name={`formulationsAttributes[${index}].injectionInstructions`}
        label={t('injectionInstructions')}
        helperText={t('helperText', {
          language: t(`languages.${project.language.code}`, {
            ns: 'common',
            defaultValue: '',
          }),
          ns: 'common',
        })}
      />
    )
  }

  return null
}

export default InjectionInstructions
