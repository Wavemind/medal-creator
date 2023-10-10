/**
 * The external imports
 */
import React, { useEffect, useMemo } from 'react'
import { useTranslation } from 'next-i18next'
import { useFormContext } from 'react-hook-form'
import { Text } from '@chakra-ui/react'

/**
 * The internal imports
 */
import Autocomplete from '@/components/inputs/autocomplete'
import { CATEGORIES_WITHOUT_COMPLAINT_CATEGORIES_OPTION } from '@/lib/config/constants'
import { useGetComplaintCategoriesQuery } from '@/lib/api/modules/enhanced/node.enhanced'
import { transformPaginationToOptions } from '@/lib/utils/transformOptions'
import { useProject } from '@/lib/hooks'
import type { VariableCategoryEnum, ComplaintCategoryComponent } from '@/types'

const ComplaintCategory: ComplaintCategoryComponent = ({
  projectId,
  restricted,
}) => {
  const { t } = useTranslation('variables')
  const { watch, setValue, getValues } = useFormContext()
  const { projectLanguage } = useProject()

  const watchCategory: VariableCategoryEnum = watch('type')

  const { data: complaintCategories } = useGetComplaintCategoriesQuery({
    projectId,
  })

  const complaintCategoriesOptions = useMemo(() => {
    if (complaintCategories) {
      return transformPaginationToOptions(
        complaintCategories.edges,
        projectLanguage
      )
    }
    return []
  }, [complaintCategories])

  useEffect(() => {
    if (restricted) {
      if (
        CATEGORIES_WITHOUT_COMPLAINT_CATEGORIES_OPTION.includes(
          watchCategory
        ) &&
        getValues('complaintCategoryOptions')
      ) {
        setValue('complaintCategoryOptions', undefined)
      }
    }
  }, [watchCategory])

  if (
    !restricted ||
    !CATEGORIES_WITHOUT_COMPLAINT_CATEGORIES_OPTION.includes(watchCategory)
  ) {
    return (
      <Autocomplete
        isMulti={true}
        name='complaintCategoryOptions'
        label={t('categories.ComplaintCategory.label')}
        placeholder={t('select', { ns: 'common' })}
        options={complaintCategoriesOptions}
        subLabel={
          <Text
            color='orange.400'
            mt={-4}
            mb={4}
            fontStyle='italic'
            fontSize='sm'
          >
            {t('complaintCategoryWarning')}
          </Text>
        }
      />
    )
  }

  return null
}

export default ComplaintCategory
