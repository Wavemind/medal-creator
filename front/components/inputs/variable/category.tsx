/**
 * The external imports
 */
import React from 'react'
import { useTranslation } from 'next-i18next'
import { useConst } from '@chakra-ui/react'

/**
 * The internal imports
 */
import { Select } from '@/components'
import { VariableService } from '@/lib/services'
import type { CategoryComponent } from '@/types'

const Category: CategoryComponent = ({ isDisabled }) => {
  const { t } = useTranslation('variables')

  const categories = useConst(() =>
    VariableService.categories.map(category => ({
      value: category,
      label: t(`categories.${category}.label`, { defaultValue: '' }),
    }))
  )

  return (
    <Select
      label={t('type')}
      options={categories}
      name='type'
      isRequired
      isDisabled={isDisabled}
    />
  )
}

export default Category
