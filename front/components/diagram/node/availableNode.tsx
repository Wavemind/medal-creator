/**
 * The external imports
 */
import { memo, useMemo } from 'react'
import { VStack, Box, Text } from '@chakra-ui/react'
import type { DragEvent } from 'react'

/**
 * The internal imports
 */
import DiagnosisNode from '@/components/diagram/node/diagnosis'
import MedicalConditionNode from '@/components/diagram/node/medicalCondition'
import VariableNode from '@/components/diagram/node/variable'
import DrugNode from '@/components/diagram/node/drug'
import ManagementNode from '@/components/diagram/node/management'
import DiagramService from '@/lib/services/diagram.service'
import { useProject } from '@/lib/hooks/useProject'
import { DiagramNodeTypeEnum } from '@/lib/config/constants'
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
      case DiagramNodeTypeEnum.Variable:
        return <VariableNode data={node} fromAvailableNode={true} />
      case DiagramNodeTypeEnum.MedicalCondition:
        return <MedicalConditionNode data={node} fromAvailableNode={true} />
      case DiagramNodeTypeEnum.Diagnosis:
        return <DiagnosisNode data={node} fromAvailableNode={true} />
      case DiagramNodeTypeEnum.Management:
        return <ManagementNode data={node} fromAvailableNode={true} />
      case DiagramNodeTypeEnum.Drug:
        return <DrugNode data={node} fromAvailableNode={true} />
      default:
        return <Text>{JSON.stringify(node)}</Text>
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
