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
import { extractTranslation } from '@/lib/utils/string'
import { useAppRouter } from '@/lib/hooks/useAppRouter'
import { useProject } from '@/lib/hooks/useProject'
import DiagramService from '@/lib/services/diagram.service'
import { useGetDiagnosisWithDecisionTreeQuery } from '@/lib/api/modules/enhanced/diagnosis.enhanced'
import AlgorithmStatus from '@/components/algorithmStatus'

const DiagnosisBreadcrumbs = () => {
  const { t } = useTranslation('diagram')

  const {
    query: { instanceableId, projectId },
  } = useAppRouter()

  const { projectLanguage, name } = useProject()

  const { data: diagnosis } = useGetDiagnosisWithDecisionTreeQuery({
    id: instanceableId,
  })

  if (diagnosis) {
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
              href={`/projects/${projectId}/algorithms/${diagnosis?.decisionTree.algorithm.id}`}
            >
              {diagnosis?.decisionTree.algorithm.name} -{' '}
              <AlgorithmStatus
                status={diagnosis!.decisionTree.algorithm.status}
              />
            </BreadcrumbLink>
          </BreadcrumbItem>

          <BreadcrumbItem>
            <BreadcrumbLink
              href={`/projects/${projectId}/diagram/decision-tree/${diagnosis?.decisionTree.id}`}
              target='_blank'
            >
              {extractTranslation(
                diagnosis?.decisionTree.labelTranslations,
                projectLanguage
              )}
            </BreadcrumbLink>
          </BreadcrumbItem>
        </Breadcrumb>

        <HStack w='full' spacing={8}>
          <Heading variant='h2' fontSize='md'>
            {extractTranslation(diagnosis?.labelTranslations, projectLanguage)}
          </Heading>
          <Heading variant='h4' fontSize='sm'>
            {extractTranslation(
              diagnosis?.decisionTree.node.labelTranslations,
              projectLanguage
            )}
          </Heading>
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
        </HStack>
      </VStack>
    )
  }

  return <Skeleton w='full' h={30} />
}

export default DiagnosisBreadcrumbs
