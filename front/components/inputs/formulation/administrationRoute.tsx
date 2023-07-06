/**
 * The external imports
 */
import React, { useMemo } from 'react'
import { useTranslation } from 'next-i18next'

/**
 * The internal imports
 */
import {
  useGetAdministrationRoutesQuery,
  useGetProjectQuery,
} from '@/lib/api/modules'
import { Select } from '@/components'
import type { AdministrationRouteComponent } from '@/types'
import { extractTranslation } from '@/lib/utils'

const AdministrationRoute: AdministrationRouteComponent = ({
  projectId,
  index,
}) => {
  const { t } = useTranslation('formulations')

  const { data: administrationRoutes, isSuccess: isGetARSuccess } =
    useGetAdministrationRoutesQuery()

  const { data: project, isSuccess: isGetProjectSuccess } = useGetProjectQuery({
    id: projectId,
  })

  const administrationRouteOptions = useMemo(() => {
    if (isGetARSuccess && isGetProjectSuccess) {
      return administrationRoutes.map(administrationRoute => ({
        value: administrationRoute.id,
        label: extractTranslation(
          administrationRoute.nameTranslations,
          project.language.code
        ),
      }))
    }

    return []
  }, [isGetARSuccess, isGetProjectSuccess, t])

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
