/**
 * The external imports
 */
import { memo, useMemo } from 'react'
import { VStack, Box } from '@chakra-ui/react'
import type { DragEvent } from 'react'

/**
 * The internal imports
 */
import DiagnosisNode from '@/components/diagram/node/diagnosis'
import MedicalConditionNode from '@/components/diagram/node/medicalCondition'
import VariableNode from '@/components/diagram/node/variable'
import DiagramService from '@/lib/services/diagram.service'
import { useProject } from '@/lib/hooks'
import type { AvailableNodeComponent } from '@/types'

const AvailableNode: AvailableNodeComponent = ({ node }) => {
  const { isAdminOrClinician } = useProject()

  const onDragStart = (event: DragEvent<HTMLDivElement>) => {
    event.dataTransfer.setData(
      'application/reactflow',
      JSON.stringify({
        id: node.id,
        fullReference: node.fullReference,
        category: node.category,
        isNeonat: node.isNeonat,
        excludingNodes: node.excludingNodes,
        labelTranslations: node.labelTranslations,
        diagramAnswers: node.diagramAnswers,
      })
    )
    event.dataTransfer.effectAllowed = 'move'
  }

  const nodeType = useMemo(() => {
    switch (DiagramService.getDiagramNodeType(node.category)) {
      case 'variable':
        return <VariableNode data={node} fromAvailableNode={true} />
      case 'medicalCondition':
        return <MedicalConditionNode data={node} fromAvailableNode={true} />
      case 'diagnosis':
        return <DiagnosisNode data={node} fromAvailableNode={true} />
    }
  }, [])

  return (
    <VStack
      onDragStart={onDragStart}
      draggable={isAdminOrClinician}
      cursor={isAdminOrClinician ? 'grab' : 'default'}
      my={2}
      mr={2}
      ml={4}
    >
      <Box w='full'>{nodeType}</Box>
    </VStack>
  )
}

export default memo(AvailableNode)
