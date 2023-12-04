/**
 * The external imports
 */
import { memo, useMemo } from 'react'
import { Text, HStack, Square } from '@chakra-ui/react'
import {
  Handle,
  Position,
  getConnectedEdges,
  useEdges,
  useNodeId,
  useReactFlow,
  type Edge,
} from 'reactflow'

/**
 * The internal imports
 */
import { extractTranslation } from '@/lib/utils/string'
import { useProject } from '@/lib/hooks/useProject'
import type { DiagramNodeAnswersComponent, InstantiatedNode } from '@/types'

const NodeAnswers: DiagramNodeAnswersComponent = ({ bg, answers }) => {
  const { projectLanguage } = useProject()

  const { getNode } = useReactFlow<InstantiatedNode, Edge>()
  const nodeId = useNodeId()
  const edges = useEdges()

  // Retrieves all outgoing edges from the node
  const outgoers = useMemo(() => {
    if (nodeId) {
      const node = getNode(nodeId)

      if (node) {
        return getConnectedEdges([node], edges)
      }
    }

    return []
  }, [nodeId, edges])

  return (
    <HStack spacing={0} justifyContent='space-evenly'>
      {answers.map((answer, index) => (
        <Handle
          type='source'
          id={answer.id}
          key={answer.id}
          position={Position.Bottom}
          isConnectable={true}
          className='answer_handle'
          style={{
            backgroundColor: outgoers.some(
              outgoer => outgoer.sourceHandle === answer.id
            )
              ? bg
              : 'white',
            borderBottomLeftRadius: index === 0 ? '10px' : '0px',
            borderBottomRightRadius:
              index === answers.length - 1 ? '10px' : '0px',
            borderColor: bg,
          }}
        >
          <Text
            color={
              outgoers.some(outgoer => outgoer.sourceHandle === answer.id)
                ? 'white'
                : 'primary'
            }
            fontSize='xs'
            pointerEvents='none'
          >
            {extractTranslation(answer.labelTranslations, projectLanguage)}
          </Text>
          <Square
            position='absolute'
            bg={bg}
            size={5}
            top={18}
            zIndex='-1'
            pointerEvents='none'
            opacity={
              outgoers.some(outgoer => outgoer.sourceHandle === answer.id)
                ? 1
                : 0.5
            }
          />
        </Handle>
      ))}
    </HStack>
  )
}

export default memo(NodeAnswers)
