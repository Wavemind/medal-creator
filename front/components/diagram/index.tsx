/**
 * The external imports
 */

import { useState, useCallback, FC } from 'react'
import {
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
import 'reactflow/dist/base.css'

/**
 * The internal imports
 */
import { VariableNode, MedicalConditionNode, DiagnosisNode } from '@/components'
import { ChevronDownIcon } from '@chakra-ui/icons'
import { BsPlus } from 'react-icons/bs'
import type { NodeData } from '@/types'

const DiagramWrapper: FC<{ initialNodes: Node<NodeData>[] }> = ({
  initialNodes,
}) => {
  const { colors } = useTheme()
  const { getNode } = useReactFlow()

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
      const sourceNode = getNode(params.source)
      if (sourceNode && sourceNode.type === 'diagnosis') {
        setEdges(eds => addEdge({ ...params, animated: true }, eds))
      } else {
        setEdges(eds => addEdge(params, eds))
      }
    }
  }, [])

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

  return (
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
    >
      <Panel position='top-right'>
        <HStack spacing={4}>
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
  )
}

export default DiagramWrapper
