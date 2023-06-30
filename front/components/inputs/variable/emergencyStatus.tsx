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
import { VariableCategoryEnum } from '@/lib/config/constants'
import { useFormContext } from 'react-hook-form'

const EmergencyStatus: FC = () => {
  const { t } = useTranslation('variables')
  const { watch } = useFormContext()

  const watchCategory: VariableCategoryEnum = watch('type')

  const emergencyStatuses = useConst(() =>
    VariableService.emergencyStatuses.map(status => ({
      value: status,
      label: t(`emergencyStatuses.${status}`, { defaultValue: '' }),
    }))
  )

  if (watchCategory !== VariableCategoryEnum.BackgroundCalculation) {
    return (
      <Select
        label={t('emergencyStatus')}
        options={emergencyStatuses}
        name='emergencyStatus'
      />
    )
  }

  return null
}

export default EmergencyStatus
