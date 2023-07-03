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
} from 'reactflow'
import { useRouter } from 'next/router'

/**
 * The external imports
 */
import { useGetProjectQuery } from '@/lib/api/modules'
import type { DiagramNodeAnswersComponent } from '@/types'

const NodeAnswers: DiagramNodeAnswersComponent = ({ bg, answers }) => {
  const {
    query: { projectId },
  } = useRouter()

  const { data: project, isSuccess: isProjectSuccess } =
    useGetProjectQuery(projectId)

  const { getNode } = useReactFlow()
  const nodeId = useNodeId()
  const edges = useEdges()

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
          style={{
            padding: '5px',
            flexGrow: 1,
            backgroundColor: outgoers.some(
              outgoer => outgoer.sourceHandle === answer.id
            )
              ? bg
              : 'white',
            borderBottomLeftRadius: index === 0 ? '10px' : '0px',
            borderBottomRightRadius:
              index === answers.length - 1 ? '10px' : '0px',
            display: 'flex',
            justifyContent: 'center',
            borderWidth: '1px',
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
            {answer.id} -{' '}
            {isProjectSuccess &&
              answer.labelTranslations[project.language.code]}
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

// TODO: Need attention, may cause problems with the memo
export default memo(NodeAnswers)
