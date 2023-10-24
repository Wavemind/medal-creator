/**
 * The external imports
 */
import { Skeleton, Tag, TagLabel, useTheme } from '@chakra-ui/react'
import { useTranslation } from 'next-i18next'
import { skipToken } from '@reduxjs/toolkit/dist/query'

/**
 * The internal imports
 */
import { useGetVariableQuery } from '@/lib/api/modules/enhanced/variable.enhanced'
import { camelize, extractTranslation } from '@/lib/utils/string'
import { useProject } from '@/lib/hooks'
import type { BadgeComponent } from '@/types'

const Badge: BadgeComponent = ({ children, variableId, functionName }) => {
  const { t } = useTranslation('variables')
  const {
    colors: { formula },
  } = useTheme()
  const { projectLanguage } = useProject()

  const { data, isSuccess } = useGetVariableQuery(
    variableId ? { id: variableId } : skipToken
  )

  if (!variableId) {
    return (
      <Tag borderRadius='full' colorScheme={formula.function}>
        <TagLabel>{children}</TagLabel>
      </Tag>
    )
  }

  if (isSuccess) {
    if (functionName) {
      return (
        <Tag borderRadius='full' colorScheme={formula.function}>
          <TagLabel>
            {t(`formulaFunctions.${camelize(functionName)}`, {
              context: 'parameters',
              variableName: extractTranslation(
                data.labelTranslations,
                projectLanguage
              ),
            })}
          </TagLabel>
        </Tag>
      )
    }
    return (
      <Tag borderRadius='full' colorScheme={formula.variable}>
        <TagLabel>
          {extractTranslation(data.labelTranslations, projectLanguage)}
        </TagLabel>
      </Tag>
    )
  }

  return (
    <Skeleton>
      <Tag borderRadius='full'>
        <TagLabel>{children}</TagLabel>
      </Tag>
    </Skeleton>
  )
}

export default Badge
