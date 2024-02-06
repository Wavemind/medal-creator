/**
 * The external imports
 */
import { VStack, HStack, Icon, Text } from '@chakra-ui/react'
import { XCircle } from 'lucide-react'
import { Trans, useTranslation } from 'next-i18next'
import Link from 'next/link'

/**
 * The internal imports
 */
import { useAppRouter } from '@/lib/hooks/useAppRouter'
import { useProject } from '@/lib/hooks/useProject'
import { extractTranslation } from '@/lib/utils/string'
import type { ValidationErrorsComponent } from '@/types'

const ValidationErrors: ValidationErrorsComponent = ({
  errors,
  selectedAlgorithmId,
}) => {
  const { t } = useTranslation('publication')

  const { projectLanguage } = useProject()

  const {
    query: { projectId },
  } = useAppRouter()

  if (errors) {
    return (
      <VStack alignItems='flex-start' spacing={8}>
        {errors.invalidDecisionTrees &&
          errors.invalidDecisionTrees.length > 0 && (
            <VStack alignItems='flex-start'>
              <Text fontSize='sm'>
                {t('errorCategories.invalidDecisionTrees')}
              </Text>
              {errors.invalidDecisionTrees?.map(error => (
                <HStack w='full'>
                  <Icon as={XCircle} color='error' />
                  <Link
                    target='_blank'
                    href={`/projects/${projectId}/diagram/decision-tree/${error.id}`}
                  >
                    <Text fontSize='xs' textDecoration='underline'>
                      {`${error.fullReference} • ${extractTranslation(
                        error.labelTranslations,
                        projectLanguage
                      )}`}
                    </Text>
                  </Link>
                </HStack>
              ))}
            </VStack>
          )}

        {errors.missingNodes && errors.missingNodes.length > 0 && (
          <VStack alignItems='flex-start'>
            <Text fontSize='sm'>
              <Trans
                i18nKey='errorCategories.missingNodes'
                t={t}
                components={{
                  l: (
                    <Text
                      as={Link}
                      target='_blank'
                      textDecoration='underline'
                      href={`/projects/${projectId}/diagram/algorithm/${selectedAlgorithmId}/`}
                    />
                  ),
                }}
              />
            </Text>
            {errors.missingNodes?.map(error => (
              <HStack w='full'>
                <Icon as={XCircle} color='error' />
                <Text fontSize='xs'>
                  {`${error.fullReference} • ${extractTranslation(
                    error.labelTranslations,
                    projectLanguage
                  )}`}
                </Text>
              </HStack>
            ))}
          </VStack>
        )}
      </VStack>
    )
  }

  return null
}

export default ValidationErrors
