/**
 * The external imports
 */
import { useState, useCallback, useRef } from 'react'
import {
  Box,
  Button,
  HStack,
  Menu,
  MenuButton,
  MenuItem,
  MenuList,
  useConst,
  useTheme,
} from '@chakra-ui/react'
import ReactFlow, {
  Controls,
  Background,
  applyNodeChanges,
  applyEdgeChanges,
  addEdge,
  MiniMap,
  useReactFlow,
  Panel,
} from 'reactflow'
import type {
  Node,
  Edge,
  OnNodesChange,
  OnEdgesChange,
  OnConnect,
} from 'reactflow'
import { useRouter } from 'next/router'
import { ChevronDownIcon } from '@chakra-ui/icons'
import { BsPlus } from 'react-icons/bs'
import { useTranslation } from 'next-i18next'
import type { DragEvent } from 'react'

/**
 * The internal imports
 */
import { VariableNode, MedicalConditionNode, DiagnosisNode } from '@/components'
import { DiagramService } from '@/lib/services'
import { useToast } from '@/lib/hooks'
import { useCreateInstanceMutation } from '@/lib/api/modules'
import type { AvailableNode, DiagramWrapperComponent } from '@/types'

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
  const reactFlowInstance = useReactFlow()

  const [nodes, setNodes] = useState(initialNodes)
  const [edges, setEdges] = useState<Edge[]>(initialEdges)

  const {
    query: { instanceableId },
  } = useRouter()

  const nodeTypes = useConst({
    variable: VariableNode,
    medicalCondition: MedicalConditionNode,
    diagnosis: DiagnosisNode,
  })

  const [createInstance] = useCreateInstanceMutation()

  const onNodesChange: OnNodesChange = useCallback(
    changes => setNodes(nds => applyNodeChanges(changes, nds)),
    []
  )

  const onEdgesChange: OnEdgesChange = useCallback(
    changes => setEdges(eds => applyEdgeChanges(changes, eds)),
    []
  )

  const onConnect: OnConnect = useCallback(params => {
    if (params.source) {
      const sourceNode = reactFlowInstance.getNode(params.source)
      if (sourceNode && sourceNode.type === 'diagnosis') {
        setEdges(eds => addEdge({ ...params, animated: true }, eds))
      } else {
        setEdges(eds => addEdge(params, eds))
      }
    }
  }, [])

  /**
   * Get the color of the node for the minimap
   * @param node Provide the node to get the color
   * @returns The color of the node
   */
  const nodeColor: string = (node: Node) => {
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
            const newNode: Node<AvailableNode> = {
              id: createInstanceResponse.data.id,
              type,
              position,
              data: droppedNode,
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

  return (
    <Box h='100%' ref={reactFlowWrapper} flexGrow={1}>
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
        nodeTypes={nodeTypes}
        onDrop={onDrop}
        onDragOver={onDragOver}
        minZoom={0.2}
      >
        <Panel position='top-right'>
          <HStack spacing={4}>
            {/*TODO: waiting design*/}
            <Menu>
              <MenuButton
                as={Button}
                variant='outline'
                leftIcon={<BsPlus />}
                rightIcon={<ChevronDownIcon />}
              >
                Add
              </MenuButton>
              <MenuList>
                <MenuItem>Download</MenuItem>
                <MenuItem>Create a Copy</MenuItem>
                <MenuItem>Mark as Draft</MenuItem>
                <MenuItem>Delete</MenuItem>
                <MenuItem>Attend a Workshop</MenuItem>
              </MenuList>
            </Menu>
            <Button>Validate</Button>
          </HStack>
        </Panel>
        <Background />
        <Controls />
        <MiniMap nodeColor={nodeColor} />
      </ReactFlow>
    </Box>
  )
}

export default DiagramWrapper