/**
 * The external imports
 */
import React, { useEffect, useMemo } from 'react'
import { useTranslation } from 'next-i18next'
import { useFormContext } from 'react-hook-form'
import type { FC } from 'react'

/**
 * The internal imports
 */
import { Select } from '@/components'
import {
  CATEGORIES_DISPLAYING_SYSTEM,
  CATEGORY_TO_SYSTEM_MAP,
  VariableTypesEnum,
} from '@/lib/config/constants'

import { usePrevious } from '@/lib/hooks'

const System: FC = () => {
  const { t } = useTranslation('variables')
  const { watch, setValue } = useFormContext()

  const watchCategory: VariableTypesEnum = watch('type')

  /**
   * Change system options based on category selected
   */
  const systems = useMemo(() => {
    if (Object.keys(CATEGORY_TO_SYSTEM_MAP).includes(watchCategory)) {
      return CATEGORY_TO_SYSTEM_MAP[
        watchCategory as keyof typeof CATEGORY_TO_SYSTEM_MAP
      ].map(system => ({
        value: system,
        label: t(`systems.${system}`, { defaultValue: system }),
      }))
    }

    return []
  }, [watchCategory])

  const previousSystem = usePrevious(systems)

  /**
   * Clear system value if systems list changed
   */
  useEffect(() => {
    if (previousSystem && previousSystem.length !== systems.length) {
      setValue('system', undefined)
    }
  }, [systems])

  if (CATEGORIES_DISPLAYING_SYSTEM.includes(watchCategory)) {
    return (
      <Select label={t('system')} options={systems} name='system' isRequired />
    )
  }

  return null
}

export default System
