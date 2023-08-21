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
import { useGetProjectQuery } from '@/lib/api/modules/enhanced/project.enhanced'
import { transformPaginationToOptions } from '@/lib/utils/transformOptions'
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
      return transformPaginationToOptions(
        complaintCategories.edges,
        project.language.code
      )
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
