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
import { useAppRouter } from '@/lib/hooks/useAppRouter'
import { useProject } from '@/lib/hooks/useProject'
import DiagramService from '@/lib/services/diagram.service'
import { useGetAlgorithmQuery } from '@/lib/api/modules/enhanced/algorithm.enhanced'

const AlgorithmBreadcrumbs = () => {
  const { t } = useTranslation('diagram')

  const {
    query: { instanceableId, projectId },
  } = useAppRouter()

  const { name } = useProject()

  const { data: algorithm, isLoading } = useGetAlgorithmQuery({
    id: instanceableId,
  })

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
      </Breadcrumb>

      <HStack w='full' spacing={8}>
        <Skeleton isLoaded={!isLoading}>
          <Heading variant='h2' fontSize='md'>
            {algorithm?.name}
          </Heading>
        </Skeleton>
        <Skeleton isLoaded={!isLoading}>
          {algorithm && algorithm.minimumAge && algorithm.ageLimit && (
            <Heading variant='h4' fontSize='sm'>
              {t('cutOffDisplay', {
                cutOffStart: DiagramService.readableDate(
                  algorithm.minimumAge,
                  t
                ),
                cutOffEnd: DiagramService.readableDate(algorithm.ageLimit, t),
              })}
            </Heading>
          )}
        </Skeleton>
      </HStack>
    </VStack>
  )
}

export default AlgorithmBreadcrumbs
