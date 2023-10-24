/**
 * The external imports
 */
import React, { useEffect, useMemo } from 'react'
import { useTranslation } from 'next-i18next'
import { useFormContext } from 'react-hook-form'

/**
 * The internal imports
 */
import Select from '@/components/inputs/select'
import { BreakableEnum, DISPLAY_BREAKABLE } from '@/lib/config/constants'
import type { BreakableComponent } from '@/types'

const Breakable: BreakableComponent = ({ index }) => {
  const { t } = useTranslation('formulations')
  const { watch, setValue, getValues } = useFormContext()

  const watchMedicationForm = watch(
    `formulationsAttributes[${index}].medicationForm`
  )
  const watchByAge = watch(`formulationsAttributes[${index}].byAge`)

  useEffect(() => {
    if (
      getValues(`formulationsAttributes[${index}].breakable`) &&
      !(!watchByAge && DISPLAY_BREAKABLE.includes(watchMedicationForm))
    ) {
      setValue(`formulationsAttributes[${index}].breakable`, undefined)
    }
  }, [watchByAge, watchMedicationForm])

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
