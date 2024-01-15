/**
 * The external imports
 */
import React from 'react'
import { useTranslation } from 'next-i18next'
import { useConst } from '@chakra-ui/react'
import { useFormContext } from 'react-hook-form'
import type { FC } from 'react'

/**
 * The internal imports
 */
import Select from '@/components/inputs/select'
import VariableService from '@/lib/services/variable.service'
import { IsDisabled, VariableCategoryEnum } from '@/types'

const EmergencyStatus: FC<IsDisabled> = ({ isDisabled }) => {
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
        isDisabled={isDisabled}
      />
    )
  }

  return null
}

export default EmergencyStatus
