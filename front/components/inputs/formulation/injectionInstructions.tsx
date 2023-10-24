/**
 * The external imports
 */
import { useEffect } from 'react'
import { useTranslation } from 'next-i18next'
import { useFormContext } from 'react-hook-form'

/**
 * The internal imports
 */
import Textarea from '@/components/inputs/textarea'
import { INJECTION_ADMINISTRATION_ROUTES } from '@/lib/config/constants'
import { useProject } from '@/lib/hooks'
import type { InjectionInstructionsComponent } from '@/types'

const InjectionInstructions: InjectionInstructionsComponent = ({ index }) => {
  const { t } = useTranslation('formulations')
  const { watch, getValues, setValue } = useFormContext()
  const { projectLanguage } = useProject()

  const watchAdministrationRoute = watch(
    `formulationsAttributes[${index}].administrationRouteId`
  )

  useEffect(() => {
    if (
      !INJECTION_ADMINISTRATION_ROUTES.includes(watchAdministrationRoute) &&
      getValues(`formulationsAttributes[${index}].injectionInstructions`)
    ) {
      setValue(
        `formulationsAttributes[${index}].injectionInstructions`,
        undefined
      )
    }
  }, [watchAdministrationRoute])

  if (
    INJECTION_ADMINISTRATION_ROUTES.includes(parseInt(watchAdministrationRoute))
  ) {
    return (
      <Textarea
        name={`formulationsAttributes[${index}].injectionInstructions`}
        label={t('injectionInstructions')}
        helperText={t('helperText', {
          language: t(`languages.${projectLanguage}`, {
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
