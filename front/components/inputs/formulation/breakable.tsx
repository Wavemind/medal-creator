/**
 * The external imports
 */
import React, { useMemo } from 'react'
import { useTranslation } from 'next-i18next'
import { useFormContext } from 'react-hook-form'

/**
 * The internal imports
 */
import { Select } from '@/components'
import { BreakableEnum, DISPLAY_BREAKABLE } from '@/lib/config/constants'
import type { BreakableComponent } from '@/types'

const Breakable: BreakableComponent = ({ index }) => {
  const { t } = useTranslation('formulations')
  const { watch } = useFormContext()

  const watchMedicationForm = watch(
    `formulationsAttributes[${index}].medicationForm`
  )
  const watchByAge = watch(`formulationsAttributes[${index}].byAge`)

  const breakableOptions = useMemo(
    () =>
      Object.values(BreakableEnum).map(breakable => ({
        value: breakable,
        label: t(`breakables.${breakable}`, { defaultValue: '' }),
      })),
    [t]
  )

  if (!watchByAge && DISPLAY_BREAKABLE.includes(watchMedicationForm)) {
    return (
      <Select
        label={t('breakable')}
        options={breakableOptions}
        name={`formulationsAttributes[${index}].breakable`}
        isRequired
      />
    )
  }

  return null
}

export default Breakable
