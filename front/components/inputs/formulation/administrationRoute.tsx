/**
 * The external imports
 */
import React, { useMemo } from 'react'
import { useTranslation } from 'next-i18next'

/**
 * The internal imports
 */
import { useGetAdministrationRoutesQuery } from '@/lib/api/modules/enhanced/administrationRoute.enhanced'
import Select from '@/components/inputs/select'
import { extractTranslation } from '@/lib/utils/string'
import { useProject } from '@/lib/hooks'
import type { AdministrationRouteComponent } from '@/types'

const AdministrationRoute: AdministrationRouteComponent = ({ index }) => {
  const { t } = useTranslation('formulations')
  const { projectLanguage } = useProject()

  const { data: administrationRoutes, isSuccess: isGetARSuccess } =
    useGetAdministrationRoutesQuery()

  const administrationRouteOptions = useMemo(() => {
    if (isGetARSuccess) {
      return administrationRoutes.map(administrationRoute => ({
        value: administrationRoute.id,
        label: extractTranslation(
          administrationRoute.nameTranslations,
          projectLanguage
        ),
      }))
    }

    return []
  }, [isGetARSuccess, t])

  return (
    <Select
      label={t('administrationRoute')}
      options={administrationRouteOptions}
      name={`formulationsAttributes[${index}].administrationRouteId`}
      isRequired
    />
  )
}

export default AdministrationRoute
