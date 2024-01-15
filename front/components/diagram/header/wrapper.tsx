/**
 * The external imports
 */
import { HStack, IconButton } from '@chakra-ui/react'
import { useTranslation } from 'next-i18next'
import { Link } from '@chakra-ui/next-js'
import { useMemo } from 'react'

/**
 * The internal imports
 */
import QuestionsSequenceBreadcrumbs from '@/components/diagram/header/questionsSequenceBreadcrumbs'
import DecisionTreeBreadcrumbs from '@/components/diagram/header/decisionTreeBreadcrumbs'
import DiagnosisBreadcrumbs from '@/components/diagram/header/diagnosisBreadcrumbs'
import AlgorithmBreadcrumbs from '@/components/diagram/header/algorithmBreadcrumbs'
import AddNodeMenu from '@/components/diagram/header/addMenuButton'
import Validate from '@/components/diagram/header/validate'
import { useAppRouter } from '@/lib/hooks/useAppRouter'
import { useDiagram } from '@/lib/hooks/useDiagram'
import CloseIcon from '@/assets/icons/Close'
import { DiagramEnum } from '@/types'

const DiagramWrapperHeader = () => {
  const { t } = useTranslation()
  const {
    query: { projectId },
  } = useAppRouter()
  const { diagramType, isEditable } = useDiagram()

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
        {isEditable && <AddNodeMenu />}
        {isEditable && <Validate />}
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
