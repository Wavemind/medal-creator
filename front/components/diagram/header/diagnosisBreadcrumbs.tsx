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
import { extractTranslation } from '@/lib/utils/string'
import { useAppRouter } from '@/lib/hooks'
import DiagramService from '@/lib/services/diagram.service'
import { useProject } from '@/lib/hooks'
import { useGetDiagnosisWithDecisionTreeQuery } from '@/lib/api/modules/enhanced/diagnosis.enhanced'

const DiagnosisBreadcrumbs = () => {
  const { t } = useTranslation('diagram')

  const {
    query: { instanceableId, projectId },
  } = useAppRouter()

  const { projectLanguage, name } = useProject()

  const { data: diagnosis, isLoading } = useGetDiagnosisWithDecisionTreeQuery({
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
              href={`/projects/${projectId}/algorithms/${diagnosis?.decisionTree.algorithm.id}`}
            >
              {diagnosis?.decisionTree.algorithm.name}
            </BreadcrumbLink>
          </Skeleton>
        </BreadcrumbItem>

        <BreadcrumbItem>
          <Skeleton isLoaded={!isLoading}>
            <BreadcrumbLink
              href={`/projects/${projectId}/diagram/decision-tree/${diagnosis?.decisionTree.id}`}
              target='_blank'
            >
              {extractTranslation(
                diagnosis?.decisionTree.labelTranslations,
                projectLanguage
              )}
            </BreadcrumbLink>
          </Skeleton>
        </BreadcrumbItem>
      </Breadcrumb>

      <HStack w='full' spacing={8}>
        <Skeleton isLoaded={!isLoading}>
          <Heading variant='h2' fontSize='md'>
            {extractTranslation(diagnosis?.labelTranslations, projectLanguage)}
          </Heading>
        </Skeleton>
        <Skeleton isLoaded={!isLoading}>
          <Heading variant='h4' fontSize='sm'>
            {extractTranslation(
              diagnosis?.decisionTree.node.labelTranslations,
              projectLanguage
            )}
          </Heading>
        </Skeleton>
        <Skeleton isLoaded={!isLoading}>
          {diagnosis &&
            diagnosis.decisionTree.cutOffStart &&
            diagnosis.decisionTree.cutOffEnd && (
              <Heading variant='h4' fontSize='sm'>
                {t('cutOffDisplay', {
                  cutOffStart: DiagramService.readableDate(
                    diagnosis.decisionTree.cutOffStart,
                    t
                  ),
                  cutOffEnd: DiagramService.readableDate(
                    diagnosis.decisionTree.cutOffEnd,
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

export default DiagnosisBreadcrumbs
