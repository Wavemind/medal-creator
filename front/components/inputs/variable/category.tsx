/**
 * The external imports
 */
import React from 'react'
import { useTranslation } from 'next-i18next'
import { useConst } from '@chakra-ui/react'

/**
 * The internal imports
 */
import Select from '@/components/inputs/select'
import VariableService from '@/lib/services/variable.service'
import { CATEGORY_AVAILABLE_DECISION_TREE } from '@/lib/config/constants'
import { CategoryComponent, DiagramEnum, VariableCategoryEnum } from '@/types'

const Category: CategoryComponent = ({ isDisabled, formEnvironment }) => {
  const { t } = useTranslation('variables')

  const isDecisionTreeDiagram = formEnvironment === DiagramEnum.DecisionTree

  const categories = useConst(() =>
    VariableService.categories
      .filter(category =>
        isDecisionTreeDiagram
          ? CATEGORY_AVAILABLE_DECISION_TREE.includes(
              category as VariableCategoryEnum
            )
          : true
      )
      .map(category => ({
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
