/**
 * The external imports
 */
import { useState, useCallback, useRef, useEffect } from 'react'
import { Flex, useConst, useTheme } from '@chakra-ui/react'
import { useTranslation } from 'next-i18next'
import ReactFlow, {
  Controls,
  Background,
  applyNodeChanges,
  applyEdgeChanges,
  addEdge,
  MiniMap,
  useReactFlow,
  OnEdgesDelete,
  OnNodesDelete,
  IsValidConnection,
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
import {
  VariableNode,
  MedicalConditionNode,
  DiagnosisNode,
  CutoffEdge,
  ExclusionEdge,
} from '@/components'
import { DiagramService } from '@/lib/services'
import { useAppRouter, useToast } from '@/lib/hooks'
import {
  useCreateInstanceMutation,
  useUpdateInstanceMutation,
  useCreateNodeExclusionsMutation,
  useCreateConditionMutation,
  useDestroyConditionMutation,
  useDestroyInstanceMutation,
} from '@/lib/api/modules'
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
  const { colors } = useTheme()
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

  useEffect(() => {
    setNodes(initialNodes)
  }, [initialNodes])

  useEffect(() => {
    setEdges(initialEdges)
  }, [initialEdges])

  const [createInstance] = useCreateInstanceMutation()
  const [updateInstance, { isError: isUpdateInstanceError }] =
    useUpdateInstanceMutation()
  const [createNodeExclusions, { isError: isCreateNodeExclusionsError }] =
    useCreateNodeExclusionsMutation()
  const [destroyInstance, { isError: isDestroyInstanceError }] =
    useDestroyInstanceMutation()
  const [
    createCondition,
    {
      data: condition,
      isSuccess: isCreateConditionSuccess,
      isError: isCreateConditionError,
    },
  ] = useCreateConditionMutation()
  const [destroyCondition, { isError: isDestroyConditionError }] =
    useDestroyConditionMutation()

  const onNodesChange: OnNodesChange = useCallback(
    changes => setNodes(nds => applyNodeChanges(changes, nds)),
    []
  )

  const onEdgesChange: OnEdgesChange = useCallback(
    changes => setEdges(eds => applyEdgeChanges(changes, eds)),
    []
  )

  const onEdgesDelete: OnEdgesDelete = useCallback(edges => {
    destroyCondition({ id: edges[0].id })
  }, [])

  const onConnect: OnConnect = useCallback(connection => {
    if (connection.source && connection.target && connection.sourceHandle) {
      const sourceNode = reactFlowInstance.getNode(connection.source)
      const targetNode = reactFlowInstance.getNode(connection.target)

      if (sourceNode && sourceNode.type === 'diagnosis') {
        // When a nodeExclusion is created, it invalidates the 'Instance' cache and forces a refetch of the components
        // TODO : Check the lag that this causes in production and improve if necessary
        createNodeExclusions({
          params: {
            nodeType: 'diagnosis',
            excludedNodeId: connection.target,
            excludingNodeId: connection.source,
          },
        })
      } else {
        if (targetNode) {
          createCondition({
            answerId: connection.sourceHandle,
            instanceId: targetNode.data.instanceId,
          })
        }
      }
    }
  }, [])

  // When a condition is created, we wait for the proper creation in the back and then update the edges
  // TODO : Check the lag that this causes in production and improve if necessary
  useEffect(() => {
    if (isCreateConditionSuccess && condition) {
      setEdges(eds =>
        addEdge(
          {
            id: condition.id,
            source: condition.answer.nodeId,
            sourceHandle: condition.answer.id,
            target: condition.instance.id,
            type: 'cutoff',
          },
          eds
        )
      )
    }
  }, [isCreateConditionSuccess])

  /**
   * Validates the connection
   * @param connection Connection
   * @returns boolean
   */
  const isValidConnection: IsValidConnection = connection => {
    if (connection && connection.source && connection.target) {
      const source = reactFlowInstance.getNode(connection.source)
      const target = reactFlowInstance.getNode(connection.target)

      if (source && target) {
        // If a diagnosis node tries to connect to a non diagnosis node
        if (source.type === 'diagnosis' && target.type !== 'diagnosis') {
          return false
        }

        // If the source and the target are the same node
        if (source.data.id === target.data.id) {
          return false
        }

        return true
      }
    }

    return false
  }

  /**
   * Get the color of the node for the minimap
   * @param node Provide the node to get the color
   * @returns The color of the node
   */
  const nodeColor = (node: Node): string => {
    switch (node.type) {
      case 'diagnosis':
        return colors.secondary
      case 'medicalCondition':
        return colors.primary
      default:
        return colors.diagram.variable
    }
  }

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

          // When an instance is created, we wait for the proper creation in the backend
          // TODO : Check the lag that this causes in production and improve if necessary
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
                instanceId: createInstanceResponse.data.id,
                ...droppedNode,
              },
            }

            setNodes(nds => nds.concat(newNode))
          } else {
            newToast({
              message: t('errorBoundary.generalError', { ns: 'common' }),
              status: 'error',
            })
          }
        }
      }
    },
    [reactFlowInstance]
  )

  // When element is dropped, send the new X and Y info to the api to save the new position
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

  // Set the isDragging flag to true if there is an actual drag
  const onNodeDrag = useCallback(() => {
    if (!isDragging) {
      setIsDragging(true)
    }
  }, [])

  // Delete the selected node
  const onNodesDelete: OnNodesDelete = useCallback(
    (nodes: Array<Node<InstantiatedNode>>) => {
      destroyInstance({ id: nodes[0].data.instanceId })
    },
    []
  )

  useEffect(() => {
    if (
      isUpdateInstanceError ||
      isCreateNodeExclusionsError ||
      isCreateConditionError ||
      isDestroyConditionError ||
      isDestroyInstanceError
    ) {
      newToast({
        message: t('errorBoundary.generalError', { ns: 'common' }),
        status: 'error',
      })
    }
  }, [
    isUpdateInstanceError,
    isCreateNodeExclusionsError,
    isCreateConditionError,
    isDestroyConditionError,
    isDestroyInstanceError,
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
        isValidConnection={isValidConnection}
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
        <MiniMap nodeColor={nodeColor} />
      </ReactFlow>
    </Flex>
  )
}

export default DiagramWrapper
