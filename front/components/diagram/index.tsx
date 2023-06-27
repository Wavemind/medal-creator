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
  MarkerType,
  useReactFlow,
  Panel,
} from 'reactflow'
import type {
  Node,
  Edge,
  OnNodesChange,
  OnEdgesChange,
  OnConnect,
  NodeTypes,
} from 'reactflow'
import { ChevronDownIcon } from '@chakra-ui/icons'
import { BsPlus } from 'react-icons/bs'
import type { FC } from 'react'

/**
 * The internal imports
 */
import { VariableNode, MedicalConditionNode, DiagnosisNode } from '@/components'
import type { NodeData } from '@/types'

const DiagramWrapper: FC<{ initialNodes: Node<NodeData>[] }> = ({
  initialNodes,
}) => {
  const { colors } = useTheme()
  const reactFlowWrapper = useRef<HTMLDivElement>(null)
  const reactFlowInstance = useReactFlow()

  const [nodes, setNodes] = useState(initialNodes)
  const [edges, setEdges] = useState<Edge[]>([])

  const nodeTypes = useConst({
    variable: VariableNode,
    medicalCondition: MedicalConditionNode,
    diagnosis: DiagnosisNode,
  })

  // Custom edge design
  const defaultEdgeOptions = {
    markerEnd: {
      type: MarkerType.ArrowClosed,
      color: 'black',
    },
  }

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
  const nodeColor: string = (node: NodeTypes) => {
    switch (node.type) {
      case 'diagnosis':
        return colors.secondary
      case 'medicalCondition':
        return colors.primary
      default:
        return colors.handle
    }
  }

  const onDragOver = useCallback(event => {
    event.preventDefault()
    event.dataTransfer.dropEffect = 'move'
  }, [])

  //TODO: finish it
  const onDrop = useCallback(
    event => {
      event.preventDefault()

      if (reactFlowWrapper.current) {
        const reactFlowBounds = reactFlowWrapper.current.getBoundingClientRect()
        const droppedNode: NodeData = JSON.parse(
          event.dataTransfer.getData('application/reactflow')
        )
        console.log(droppedNode)
        // Check if the dropped element is valid
        if (typeof droppedNode === 'undefined' || !droppedNode) {
          return
        }

        const position = reactFlowInstance.project({
          x: event.clientX - reactFlowBounds.left,
          y: event.clientY - reactFlowBounds.top,
        })

        const newNode: Node<NodeData> = {
          id: droppedNode.id,
          type: droppedNode.type,
          position,
          data: droppedNode,
        }

        setNodes(nds => nds.concat(newNode))
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
        defaultEdgeOptions={defaultEdgeOptions}
        onEdgesChange={onEdgesChange}
        onConnect={onConnect}
        nodeTypes={nodeTypes}
        onDrop={onDrop}
        onDragOver={onDragOver}
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
