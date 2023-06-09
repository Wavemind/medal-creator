/**
 * The external imports
 */
import React from 'react'
import { useTranslation } from 'next-i18next'
import { useConst } from '@chakra-ui/react'
import type { FC } from 'react'

/**
 * The internal imports
 */
import { Select } from '@/components'
import { VariableService } from '@/lib/services'

const EmergencyStatus: FC = () => {
  const { t } = useTranslation('variables')

  const emergencyStatuses = useConst(() =>
    VariableService.emergencyStatuses.map(status => ({
      value: status,
      label: t(`emergencyStatuses.${status}`, { defaultValue: '' }),
    }))
  )

  return (
    <Select
      label={t('emergencyStatus')}
      options={emergencyStatuses}
      name='emergencyStatus'
    />
  )
}

export default EmergencyStatus
