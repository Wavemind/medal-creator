/**
 * The external imports
 */

import { useState, useCallback, FC } from 'react'
import { useConst } from '@chakra-ui/react'
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
import { VariableNode, MedicalConditionNode } from '@/components'

const DiagramWrapper: FC = ({ initialNodes }) => {
  const [nodes, setNodes] = useState<Node[]>(initialNodes)
  const [edges, setEdges] = useState<Edge[]>([])

  const nodeTypes = useConst({
    variable: VariableNode,
    medicalCondition: MedicalConditionNode,
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

  const onConnect: OnConnect = useCallback(
    params => setEdges(eds => addEdge(params, eds)),
    []
  )

  return (
    <ReactFlow
      defaultNodes={nodes}
      onNodesChange={onNodesChange}
      edges={edges}
      fitView
      defaultEdgeOptions={defaultEdgeOptions}
      onEdgesChange={onEdgesChange}
      onConnect={onConnect}
      nodeTypes={nodeTypes}
    >
      <Background />
      <Controls />
      <MiniMap />
    </ReactFlow>
  )
}

export default DiagramWrapper
