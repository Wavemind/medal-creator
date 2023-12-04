/**
 * The external imports
 */
import { useMemo } from 'react'
import { HStack, IconButton } from '@chakra-ui/react'
import { Link } from '@chakra-ui/next-js'
import { useTranslation } from 'next-i18next'

/**
 * The internal imports
 */
import DecisionTreeBreadcrumbs from '@/components/diagram/header/decisionTreeBreadcrumbs'
import DiagnosisBreadcrumbs from '@/components/diagram/header/diagnosisBreadcrumbs'
import QuestionsSequenceBreadcrumbs from '@/components/diagram/header/questionsSequenceBreadcrumbs'
import AlgorithmBreadcrumbs from '@/components/diagram/header/algorithmBreadcrumbs'
import AddNodeMenu from '@/components/diagram/header/addMenuButton'
import Validate from '@/components/diagram/header/validate'
import { useAppRouter } from '@/lib/hooks/useAppRouter'
import { useDiagram } from '@/lib/hooks/useDiagram'
import { useProject } from '@/lib/hooks/useProject'
import CloseIcon from '@/assets/icons/Close'
import { DiagramEnum } from '@/types'

const DiagramWrapperHeader = () => {
  const { t } = useTranslation()
  const {
    query: { projectId },
  } = useAppRouter()
  const { diagramType } = useDiagram()
  const { isAdminOrClinician } = useProject()

  const breadcrumbs = useMemo(() => {
    switch (diagramType) {
      case DiagramEnum.DecisionTree:
        return <DecisionTreeBreadcrumbs />
      case DiagramEnum.Diagnosis:
        return <DiagnosisBreadcrumbs />
      case DiagramEnum.QuestionsSequence:
      case DiagramEnum.QuestionsSequenceScored:
        return <QuestionsSequenceBreadcrumbs />
      case DiagramEnum.Algorithm:
        return <AlgorithmBreadcrumbs />
      default:
        break
    }
  }, [])

  return (
    <HStack w='full' p={4} justifyContent='space-evenly'>
      {breadcrumbs}
      <HStack spacing={4}>
        {isAdminOrClinician && <AddNodeMenu />}
        {isAdminOrClinician && <Validate />}
        <IconButton
          as={Link}
          variant='ghost'
          ml={4}
          href={`/projects/${projectId}`}
          icon={<CloseIcon />}
          aria-label={t('close', { ns: 'common' })}
        />
      </HStack>
    </HStack>
  )
}

export default DiagramWrapperHeader
