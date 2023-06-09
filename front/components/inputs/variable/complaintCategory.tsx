/**
 * The external imports
 */
import React, { useEffect, useMemo } from 'react'
import { useTranslation } from 'next-i18next'
import { useFormContext } from 'react-hook-form'

/**
 * The internal imports
 */
import { Autocomplete } from '@/components'
import { CATEGORIES_WITHOUT_COMPLAINT_CATEGORIES_OPTION } from '@/lib/config/constants'
import {
  useGetComplaintCategoriesQuery,
  useGetProjectQuery,
} from '@/lib/api/modules'
import { extractTranslation } from '@/lib/utils'
import type { VariableCategoryEnum, ComplaintCategoryComponent } from '@/types'

const ComplaintCategory: ComplaintCategoryComponent = ({ projectId }) => {
  const { t } = useTranslation('variables')
  const { watch, setValue, getValues } = useFormContext()

  const watchCategory: VariableCategoryEnum = watch('type')

  const { data: project } = useGetProjectQuery({ id: projectId })
  const { data: complaintCategories } = useGetComplaintCategoriesQuery({
    projectId,
  })

  const complaintCategoriesOptions = useMemo(() => {
    if (complaintCategories && project) {
      return complaintCategories.edges.map(edge => ({
        value: edge.node.id,
        label: extractTranslation(
          edge.node.labelTranslations,
          project.language.code
        ),
      }))
    }
    return []
  }, [complaintCategories, project])

  useEffect(() => {
    if (
      CATEGORIES_WITHOUT_COMPLAINT_CATEGORIES_OPTION.includes(watchCategory) &&
      getValues('complaintCategoryOptions')
    ) {
      setValue('complaintCategoryOptions', undefined)
    }
  }, [watchCategory])

  if (!CATEGORIES_WITHOUT_COMPLAINT_CATEGORIES_OPTION.includes(watchCategory)) {
    return (
      <Autocomplete
        isMulti={true}
        name='complaintCategoryOptions'
        label={t('categories.complaintCategory.label')}
        placeholder={t('select', { ns: 'common' })}
        options={complaintCategoriesOptions}
      />
    )
  }

  return null
}

export default ComplaintCategory
