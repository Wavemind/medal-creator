/**
 * The external imports
 */
import { useState, useCallback, useRef, useEffect } from 'react'
import { Flex, useConst } from '@chakra-ui/react'
import { useTranslation } from 'next-i18next'
import ReactFlow, {
  Controls,
  Background,
  applyNodeChanges,
  applyEdgeChanges,
  MiniMap,
  useReactFlow,
  OnEdgesDelete,
  OnNodesDelete,
  addEdge,
} from 'reactflow'
import type {
  Node,
  Edge,
  OnNodesChange,
  OnEdgesChange,
  OnConnect,
} from 'reactflow'
import type { DragEvent, MouseEvent } from 'react'

/**
 * The internal imports
 */
import VariableNode from './node/variable'
import MedicalConditionNode from './node/medicalCondition'
import DiagnosisNode from './node/diagnosis'
import CutoffEdge from './edge/cutoffEdge'
import ExclusionEdge from './edge/exclusionEdge'
import DiagramService from '@/lib/services/diagram.service'
import { useAppRouter, useToast } from '@/lib/hooks'
import {
  useCreateInstanceMutation,
  useUpdateInstanceMutation,
  useDestroyInstanceMutation,
} from '@/lib/api/modules/enhanced/instance.enhanced'
import {
  useCreateNodeExclusionsMutation,
  useDestroyNodeExclusionMutation,
} from '@/lib/api/modules/enhanced/nodeExclusion.enhanced'
import {
  useCreateConditionMutation,
  useDestroyConditionMutation,
} from '@/lib/api/modules/enhanced/condition.enhanced'
import type {
  AvailableNode,
  DiagramWrapperComponent,
  InstantiatedNode,
} from '@/types'

// TODO NEED TO CHECK USER'S PERMISSIONS
// TODO : Need to improve/simplify
const DiagramWrapper: DiagramWrapperComponent = ({
  initialNodes,
  initialEdges,
  diagramType,
}) => {
  const { t } = useTranslation('diagram')
  const { newToast } = useToast()

  const reactFlowWrapper = useRef<HTMLDivElement>(null)
  const reactFlowInstance = useReactFlow<InstantiatedNode, Edge>()

  const [nodes, setNodes] = useState(initialNodes)
  const [edges, setEdges] = useState<Edge[]>(initialEdges)

  const [isDragging, setIsDragging] = useState(false)

  const {
    query: { instanceableId },
  } = useAppRouter()

  const nodeTypes = useConst({
    variable: VariableNode,
    medicalCondition: MedicalConditionNode,
    diagnosis: DiagnosisNode,
  })

  const edgeTypes = useConst({
    cutoff: CutoffEdge,
    exclusion: ExclusionEdge,
  })

  const [createInstance, { isError: isCreateInstanceError }] =
    useCreateInstanceMutation()
  const [updateInstance, { isError: isUpdateInstanceError }] =
    useUpdateInstanceMutation()
  const [createNodeExclusions, { isError: isCreateNodeExclusionsError }] =
    useCreateNodeExclusionsMutation()
  const [destroyInstance, { isError: isDestroyInstanceError }] =
    useDestroyInstanceMutation()
  const [createCondition, { isError: isCreateConditionError }] =
    useCreateConditionMutation()
  const [destroyCondition, { isError: isDestroyConditionError }] =
    useDestroyConditionMutation()
  const [destroyNodeExclusion, { isError: isDestroyNodeExclusionError }] =
    useDestroyNodeExclusionMutation()

  const onNodesChange: OnNodesChange = useCallback(
    changes => setNodes(nds => applyNodeChanges(changes, nds)),
    []
  )

  const onEdgesChange: OnEdgesChange = useCallback(
    changes => setEdges(eds => applyEdgeChanges(changes, eds)),
    []
  )

  /**
   * destroyNodeExclusion takes both excluding and excluded node ids because:
   * 1. We don't have the nodeExclusion id
   * 2. The combination excluded and excluding node id is unique and we can find the correct nodeExclusion using that combo
   * destroyCondition takes the condition id
   */
  const onEdgesDelete: OnEdgesDelete = useCallback(edges => {
    if (edges[0].selected) {
      const sourceNode = reactFlowInstance.getNode(edges[0].source)

      if (sourceNode && sourceNode.type === 'diagnosis') {
        destroyNodeExclusion({
          excludingNodeId: edges[0].source,
          excludedNodeId: edges[0].target,
        })
      } else {
        destroyCondition({ id: edges[0].id })
      }
    }
  }, [])

  const onConnect: OnConnect = useCallback(async connection => {
    if (connection.source && connection.target && connection.sourceHandle) {
      const sourceNode = reactFlowInstance.getNode(connection.source)
      const targetNode = reactFlowInstance.getNode(connection.target)

      // Create exclusion edge
      if (sourceNode && sourceNode.type === 'diagnosis') {
        const createNodeExclusionsResponse = await createNodeExclusions({
          params: {
            nodeType: 'diagnosis',
            excludedNodeId: connection.target,
            excludingNodeId: connection.source,
          },
        })

        if ('data' in createNodeExclusionsResponse) {
          setEdges(eds =>
            addEdge(
              {
                ...connection,
                id: `${connection.sourceHandle}-${connection.targetHandle}`,
                type: 'exclusion',
              },
              eds
            )
          )
        }
        // Create edge
      } else if (targetNode) {
        const createConditionResponse = await createCondition({
          answerId: connection.sourceHandle,
          instanceId: targetNode.data.instanceId,
        })

        if ('data' in createConditionResponse) {
          setEdges(eds =>
            addEdge(
              {
                ...connection,
                id: createConditionResponse.data.id,
                type: 'cutoff',
                data: {
                  cutOffStart: null,
                  cutOffEnd: null,
                },
              },
              eds
            )
          )
        }
      }
    }
  }, [])

  const onDragOver = useCallback((event: DragEvent<HTMLDivElement>) => {
    event.preventDefault()
    event.dataTransfer.dropEffect = 'move'
  }, [])

  const onDrop = useCallback(
    async (event: DragEvent<HTMLDivElement>) => {
      event.preventDefault()

      if (reactFlowWrapper.current) {
        const reactFlowBounds = reactFlowWrapper.current.getBoundingClientRect()
        const droppedNode: AvailableNode = JSON.parse(
          event.dataTransfer.getData('application/reactflow')
        )

        // Check if the dropped element is valid
        if (typeof droppedNode === 'undefined' || !droppedNode) {
          newToast({
            message: t('errorBoundary.generalError', { ns: 'common' }),
            status: 'error',
          })
          return
        }

        const type = DiagramService.getDiagramNodeType(droppedNode.category)

        if (type) {
          const position = reactFlowInstance.project({
            x: event.clientX - reactFlowBounds.left,
            y: event.clientY - reactFlowBounds.top,
          })

          const createInstanceResponse = await createInstance({
            instanceableType: diagramType,
            instanceableId: instanceableId,
            nodeId: droppedNode.id,
            positionX: position.x,
            positionY: position.y,
          })

          // Check if the instance has been created
          if ('data' in createInstanceResponse) {
            const newNode: Node<InstantiatedNode> = {
              id: droppedNode.id,
              type,
              position,
              data: {
                instanceId: createInstanceResponse.data.instance.id,
                ...droppedNode,
              },
            }
            setNodes(nds => nds.concat(newNode))
          }
        }
      }
    },
    [reactFlowInstance]
  )

  /**
   * When element is dropped, send the new X and Y info to the api to save the new position
   */
  const onNodeDragStop = useCallback(
    (_: MouseEvent, node: Node<InstantiatedNode>) => {
      if (isDragging) {
        updateInstance({
          id: node.data.instanceId,
          positionX: node.position.x,
          positionY: node.position.y,
        })
        setIsDragging(false)
      }
    },
    [isDragging]
  )

  /**
   * Set the isDragging flag to true if there is an actual drag
   */
  const onNodeDrag = useCallback(() => {
    if (!isDragging) {
      setIsDragging(true)
    }
  }, [])

  /**
   * Delete the selected node
   */
  const onNodesDelete: OnNodesDelete = useCallback(
    (nodes: Array<Node<InstantiatedNode>>) => {
      destroyInstance({ id: nodes[0].data.instanceId })
    },
    []
  )

  useEffect(() => {
    if (
      isCreateInstanceError ||
      isUpdateInstanceError ||
      isCreateNodeExclusionsError ||
      isCreateConditionError ||
      isDestroyConditionError ||
      isDestroyInstanceError ||
      isDestroyNodeExclusionError
    ) {
      newToast({
        message: t('errorBoundary.generalError', { ns: 'common' }),
        status: 'error',
      })
    }
  }, [
    isCreateInstanceError,
    isUpdateInstanceError,
    isCreateNodeExclusionsError,
    isCreateConditionError,
    isDestroyConditionError,
    isDestroyInstanceError,
    isDestroyNodeExclusionError,
  ])

  return (
    <Flex ref={reactFlowWrapper} w='full' h='full'>
      <ReactFlow
        nodes={nodes}
        edges={edges}
        deleteKeyCode={['Backspace', 'Delete']}
        connectionRadius={40}
        onNodesChange={onNodesChange}
        fitView
        defaultEdgeOptions={DiagramService.DEFAULT_EDGE_OPTIONS}
        onEdgesChange={onEdgesChange}
        onEdgesDelete={onEdgesDelete}
        onConnect={onConnect}
        isValidConnection={connection =>
          DiagramService.isValidConnection(connection, reactFlowInstance)
        }
        nodeTypes={nodeTypes}
        edgeTypes={edgeTypes}
        onDrop={onDrop}
        onDragOver={onDragOver}
        nodeOrigin={[0.5, 0.5]}
        minZoom={0.2}
        onNodeDrag={onNodeDrag}
        onNodeDragStop={onNodeDragStop}
        onNodesDelete={onNodesDelete}
      >
        <Background />
        <Controls />
        <MiniMap nodeColor={DiagramService.getNodeColorByType} />
      </ReactFlow>
    </Flex>
  )
}

export default DiagramWrapper
