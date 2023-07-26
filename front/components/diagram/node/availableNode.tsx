/**
 * The external imports
 */
import { memo, useMemo } from 'react'
import { VStack } from '@chakra-ui/react'
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
        excludingNodes: node.excludingNodes,
        isNeonat: node.isNeonat,
        labelTranslations: node.labelTranslations,
        diagramAnswers: node.diagramAnswers,
      })
    )
    event.dataTransfer.effectAllowed = 'move'
  }

  // Render correct node type
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
    <VStack onDragStart={onDragStart} draggable cursor='grab'>
      {nodeType}
    </VStack>
  )
}

export default memo(AvailableNode)
