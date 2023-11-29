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
import { useGetQuestionsSequenceQuery } from '@/lib/api/modules/enhanced/questionSequences.enhanced'

const QuestionsSequenceBreadcrumbs = () => {
  const { t } = useTranslation('diagram')

  const {
    query: { instanceableId, projectId },
  } = useAppRouter()

  const { projectLanguage, name } = useProject()

  const { data: questionsSequence, isLoading } = useGetQuestionsSequenceQuery({
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
      </Breadcrumb>
      <HStack w='full' spacing={8}>
        <Skeleton isLoaded={!isLoading}>
          <Heading variant='h2' fontSize='md'>
            {extractTranslation(
              questionsSequence?.labelTranslations,
              projectLanguage
            )}
          </Heading>
        </Skeleton>
        <Skeleton isLoaded={!isLoading}>
          {questionsSequence &&
            questionsSequence.cutOffStart &&
            questionsSequence.cutOffEnd && (
              <Heading variant='h4' fontSize='sm'>
                {t('cutOffDisplay', {
                  cutOffStart: DiagramService.readableDate(
                    questionsSequence.cutOffStart,
                    t
                  ),
                  cutOffEnd: DiagramService.readableDate(
                    questionsSequence.cutOffEnd,
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

export default QuestionsSequenceBreadcrumbs
