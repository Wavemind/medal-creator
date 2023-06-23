/**
 * The external imports
 */

import { useState, useCallback, FC } from 'react'
import { useConst, useTheme } from '@chakra-ui/react'
import ReactFlow, {
  Controls,
  Background,
  applyNodeChanges,
  applyEdgeChanges,
  addEdge,
  MiniMap,
  MarkerType,
} from 'reactflow'
import type {
  Node,
  Edge,
  OnNodesChange,
  OnEdgesChange,
  OnConnect,
} from 'reactflow'
import 'reactflow/dist/base.css'

/**
 * The internal imports
 */
import { VariableNode, MedicalConditionNode, DiagnosisNode } from '@/components'

const DiagramWrapper: FC = ({ initialNodes }) => {
  const { colors } = useTheme()

  const [nodes, setNodes] = useState<Node[]>(initialNodes)
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
    console.log(params)
    setEdges(eds => addEdge(params, eds))
  }, [])

  const nodeColor = node => {
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
      <Background />
      <Controls />
      <MiniMap nodeColor={nodeColor} />
    </ReactFlow>
  )
}

export default DiagramWrapper
