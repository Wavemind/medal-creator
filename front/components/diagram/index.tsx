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
} from 'reactflow'
import type {
  Node,
  Edge,
  OnNodesChange,
  OnEdgesChange,
  OnConnect,
  Connection,
} from 'reactflow'
import type { DragEvent, MouseEvent } from 'react'

/**
 * The internal imports
 */
import { VariableNode, MedicalConditionNode, DiagnosisNode } from '@/components'
import { DiagramService } from '@/lib/services'
import { useAppRouter, useToast } from '@/lib/hooks'
import {
  useCreateInstanceMutation,
  useUpdateInstanceMutation,
} from '@/lib/api/modules'
import type {
  AvailableNode,
  DiagramWrapperComponent,
  InstantiatedNode,
} from '@/types'
import { useCreateNodeExclusionsMutation } from '@/lib/api/modules/enhanced/nodeExclusion.enhanced'

// TODO NEED TO CHECK USER'S PERMISSIONS
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

  useEffect(() => {
    setNodes(initialNodes)
  }, [initialNodes])

  useEffect(() => {
    setEdges(initialEdges)
  }, [initialEdges])

  const [createInstance] = useCreateInstanceMutation()
  const [
    updateInstance,
    { isSuccess: isUpdateInstanceSuccess, isError: isUpdateInstanceError },
  ] = useUpdateInstanceMutation()
  const [createNodeExclusions, { isError: isCreateNodeExclusionsError }] =
    useCreateNodeExclusionsMutation()

  const onNodesChange: OnNodesChange = useCallback(
    changes => setNodes(nds => applyNodeChanges(changes, nds)),
    []
  )

  const onEdgesChange: OnEdgesChange = useCallback(
    changes => setEdges(eds => applyEdgeChanges(changes, eds)),
    []
  )

  const onConnect: OnConnect = useCallback(connection => {
    if (connection.source && connection.target) {
      const sourceNode = reactFlowInstance.getNode(connection.source)
      const targetNode = reactFlowInstance.getNode(connection.target)

      if (sourceNode && sourceNode.type === 'diagnosis' && targetNode) {
        setEdges(eds => addEdge({ ...connection, animated: true }, eds))
        createNodeExclusions({
          params: {
            nodeType: 'diagnosis',
            excludedNodeId: targetNode.data.id,
            excludingNodeId: sourceNode.data.id,
          },
        })
      } else {
        setEdges(eds => addEdge(connection, eds))
      }
    }
  }, [])

  /**
   * Validates the connection
   * @param connection Connection
   * @returns boolean
   */
  const handleValidConnection = (connection: Connection): boolean => {
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
                instanceableId: createInstanceResponse.data.id,
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
  // TODO : Clarify the naming of instanceableId. The one coming from router is not the same as
  // the one in the node data
  const handleDragStop = useCallback(
    (_: MouseEvent, node: Node<InstantiatedNode>) => {
      if (isDragging) {
        updateInstance({
          id: node.data.instanceableId,
          positionX: node.position.x,
          positionY: node.position.y,
        })
        setIsDragging(false)
      }
    },
    [isDragging]
  )

  // Set the isDragging flag to true if there is an actual drag
  const handleDrag = useCallback(() => {
    if (!isDragging) {
      setIsDragging(true)
    }
  }, [])

  useEffect(() => {
    if (isUpdateInstanceSuccess) {
      newToast({
        message: t('notifications.updateSuccess', { ns: 'common' }),
        status: 'success',
      })
    }
  }, [isUpdateInstanceSuccess])

  useEffect(() => {
    if (isUpdateInstanceError || isCreateNodeExclusionsError) {
      newToast({
        message: t('errorBoundary.generalError', { ns: 'common' }),
        status: 'error',
      })
    }
  }, [isUpdateInstanceError, isCreateNodeExclusionsError])

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
        onConnect={onConnect}
        isValidConnection={handleValidConnection}
        nodeTypes={nodeTypes}
        onDrop={onDrop}
        onDragOver={onDragOver}
        nodeOrigin={[0.5, 0.5]}
        minZoom={0.2}
        onNodeDrag={handleDrag}
        onNodeDragStop={handleDragStop}
      >
        <Background />
        <Controls />
        <MiniMap nodeColor={nodeColor} />
      </ReactFlow>
    </Flex>
  )
}

export default DiagramWrapper
