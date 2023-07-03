/**
 * The external imports
 */
import { memo } from 'react'
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
        instanceableId: node.instanceableId,
        excludingNodes: node.excludingNodes,
        isNeonat: node.isNeonat,
        labelTranslations: node.labelTranslations,
        diagramAnswers: node.diagramAnswers,
      })
    )
    event.dataTransfer.effectAllowed = 'move'
  }

  const getNodeType = () => {
    switch (DiagramService.getDiagramNodeType(node.category)) {
      case 'variable':
        return <VariableNode data={node} fromAvailableNode={true} />
      case 'medicalCondition':
        return <MedicalConditionNode data={node} fromAvailableNode={true} />
      case 'diagnosis':
        return <DiagnosisNode data={node} fromAvailableNode={true} />
    }
  }

  return (
    <VStack onDragStart={event => onDragStart(event)} draggable cursor='grab'>
      {getNodeType()}
    </VStack>
  )
}

export default memo(AvailableNode)
