/**
 * The external imports
 */
import {
  HStack,
  Skeleton,
  Heading,
  VStack,
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
} from '@chakra-ui/react'
import { ChevronRightIcon } from '@chakra-ui/icons'
import { useTranslation } from 'next-i18next'

/**
 * The internal imports
 */
import { useGetDecisionTreeQuery } from '@/lib/api/modules/enhanced/decisionTree.enhanced'
import { extractTranslation } from '@/lib/utils/string'
import { useAppRouter } from '@/lib/hooks'
import DiagramService from '@/lib/services/diagram.service'
import { useProject } from '@/lib/hooks'

const DecisionTreeHeader = () => {
  const { t } = useTranslation('diagram')

  const {
    query: { instanceableId, projectId },
  } = useAppRouter()

  const { projectLanguage, name } = useProject()

  const { data: decisionTree, isLoading } = useGetDecisionTreeQuery({
    id: instanceableId,
  })

  return (
    <VStack w='full' alignItems='flex-start'>
      <Breadcrumb
        fontSize='xs'
        separator={<ChevronRightIcon color='gray.500' />}
      >
        <BreadcrumbItem>
          <BreadcrumbLink href={`/projects/${projectId}`}>
            {name}
          </BreadcrumbLink>
        </BreadcrumbItem>

        <BreadcrumbItem>
          <Skeleton isLoaded={!isLoading}>
            <BreadcrumbLink
              href={`/projects/${projectId}/algorithms/${decisionTree?.algorithm.id}`}
            >
              {decisionTree?.algorithm.name}
            </BreadcrumbLink>
          </Skeleton>
        </BreadcrumbItem>
      </Breadcrumb>
      <HStack w='full' spacing={8}>
        <Skeleton isLoaded={!isLoading}>
          <Heading variant='h2' fontSize='md'>
            {extractTranslation(
              decisionTree?.labelTranslations,
              projectLanguage
            )}
          </Heading>
        </Skeleton>
        <Skeleton isLoaded={!isLoading}>
          <Heading variant='h4' fontSize='sm'>
            {extractTranslation(
              decisionTree?.node.labelTranslations,
              projectLanguage
            )}
          </Heading>
        </Skeleton>
        <Skeleton isLoaded={!isLoading}>
          {decisionTree &&
            decisionTree.cutOffStart &&
            decisionTree.cutOffEnd && (
              <Heading variant='h4' fontSize='sm'>
                {t('cutOffDisplay', {
                  cutOffStart: DiagramService.readableDate(
                    decisionTree.cutOffStart,
                    t
                  ),
                  cutOffEnd: DiagramService.readableDate(
                    decisionTree.cutOffEnd,
                    t
                  ),
                })}
              </Heading>
            )}
        </Skeleton>
      </HStack>
    </VStack>
  )
}

export default DecisionTreeHeader
