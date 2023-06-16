/**
 * The external imports
 */
import { useTranslation } from 'next-i18next'
import { useFormContext } from 'react-hook-form'
import type { FC } from 'react'

/**
 * The internal imports
 */
import { Textarea } from '@/components'
import { INJECTION_ADMINISTRATION_ROUTES } from '@/lib/config/constants'
import { useGetProjectQuery } from '@/lib/api/modules'

const InjectionInstructions: FC<{ index: number; projectId: number }> = ({
  index,
  projectId,
}) => {
  const { t } = useTranslation('formulations')
  const { watch } = useFormContext()

  const { data: project, isSuccess: isGetProjectSuccess } =
    useGetProjectQuery(projectId)

  const watchAdministrationRoute = watch(
    `formulationsAttributes[${index}].administrationRoute`
  )

  if (
    INJECTION_ADMINISTRATION_ROUTES.includes(watchAdministrationRoute) &&
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
