/**
 * The external imports
 */
import { memo, useMemo } from 'react'
import { VStack, Box } from '@chakra-ui/react'
import type { DragEvent } from 'react'

/**
 * The internal imports
 */
import { DiagnosisNode, MedicalConditionNode, VariableNode } from '@/components'
import { DiagramService } from '@/lib/services'
import type { AvailableNodeComponent } from '@/types'

const AvailableNode: AvailableNodeComponent = ({ node }) => {
  const onDragStart = (event: DragEvent<HTMLDivElement>) => {
    event.dataTransfer.setData(
      'application/reactflow',
      JSON.stringify({
        id: node.id,
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
      draggable
      cursor='grab'
      my={2}
      mr={2}
      ml={4}
    >
      <Box w='full'>{nodeType}</Box>
    </VStack>
  )
}

export default memo(AvailableNode)
