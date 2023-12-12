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
  Icon,
} from '@chakra-ui/react'
import { ChevronRight } from 'lucide-react'
import { useTranslation } from 'next-i18next'

/**
 * The internal imports
 */
import { useGetDecisionTreeQuery } from '@/lib/api/modules/enhanced/decisionTree.enhanced'
import { extractTranslation } from '@/lib/utils/string'
import { useAppRouter } from '@/lib/hooks/useAppRouter'
import { useProject } from '@/lib/hooks/useProject'
import DiagramService from '@/lib/services/diagram.service'
import AlgorithmStatus from '@/components/algorithmStatus'

const DecisionTreeBreadcrumbs = () => {
  const { t } = useTranslation('diagram')

  const {
    query: { instanceableId, projectId },
  } = useAppRouter()

  const { projectLanguage, name } = useProject()

  const { data: decisionTree, isLoading } = useGetDecisionTreeQuery({
    id: instanceableId,
  })

  if (decisionTree) {
    return (
      <VStack w='full' alignItems='flex-start'>
        <Breadcrumb
          fontSize='xs'
          separator={<Icon as={ChevronRight} color='gray.500' />}
        >
          <BreadcrumbItem>
            <BreadcrumbLink href={`/projects/${projectId}`}>
              {name}
            </BreadcrumbLink>
          </BreadcrumbItem>

          <BreadcrumbItem>
            <BreadcrumbLink
              href={`/projects/${projectId}/algorithms/${decisionTree?.algorithm.id}`}
            >
              {decisionTree?.algorithm.name} -{' '}
              <AlgorithmStatus status={decisionTree!.algorithm.status} />
            </BreadcrumbLink>
          </BreadcrumbItem>
        </Breadcrumb>
        <HStack w='full' spacing={8}>
          <Heading variant='h2' fontSize='md'>
            {extractTranslation(
              decisionTree?.labelTranslations,
              projectLanguage
            )}
          </Heading>
          <Heading variant='h4' fontSize='sm'>
            {extractTranslation(
              decisionTree?.node.labelTranslations,
              projectLanguage
            )}
          </Heading>
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
        </HStack>
      </VStack>
    )
  }

  return <Skeleton w='full' h={30} />
}

export default DecisionTreeBreadcrumbs
