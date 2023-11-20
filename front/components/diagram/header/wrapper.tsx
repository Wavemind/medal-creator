/**
 * The external imports
 */
import { useMemo } from 'react'
import { HStack, IconButton } from '@chakra-ui/react'
import { Link } from '@chakra-ui/next-js'

/**
 * The internal imports
 */
import DecisionTreeHeader from '@/components/diagram/header/decisionTree'
import DiagnosisHeader from '@/components/diagram/header/diagnosis'
import AddNodeMenu from '@/components/diagram/header/addMenuButton'
import Validate from '@/components/diagram/header/validate'
import { useAppRouter, useDiagram } from '@/lib/hooks'
import { useProject } from '@/lib/hooks'
import CloseIcon from '@/assets/icons/Close'
import { DiagramEnum } from '@/types'

const DiagramWrapperHeader = () => {
  const {
    query: { instanceableId, projectId },
  } = useAppRouter()
  const { diagramType } = useDiagram()

  const { isAdminOrClinician } = useProject()

  const breadcrumbs = useMemo(() => {
    switch (diagramType) {
      case DiagramEnum.DecisionTree:
        return <DecisionTreeHeader />
      case DiagramEnum.Diagnosis:
        return <DiagnosisHeader />
      default:
        break
    }
  }, [instanceableId])

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
          aria-label='close'
        />
      </HStack>
    </HStack>
  )
}

export default DiagramWrapperHeader
