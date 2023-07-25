/**
 * The external imports
 */
import { type EdgeProps, BaseEdge, getBezierPath } from 'reactflow'
import type { FC } from 'react'

const ExclusionEdge: FC<EdgeProps> = ({
  sourceX,
  sourceY,
  targetX,
  targetY,
  sourcePosition,
  targetPosition,
  style = {},
  markerEnd,
}) => {
  const [edgePath] = getBezierPath({
    sourceX,
    sourceY,
    sourcePosition,
    targetX,
    targetY,
    targetPosition,
  })

  return <BaseEdge path={edgePath} markerEnd={markerEnd} style={style} />
}

export default ExclusionEdge
