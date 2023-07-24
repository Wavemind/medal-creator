/**
 * The external imports
 */
import React, { FC } from 'react'
import { BaseEdge, EdgeProps, getBezierPath } from 'reactflow'

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
