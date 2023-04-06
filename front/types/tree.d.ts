/**
 * The external imports
 */
import type { FC } from 'react'
import type { DropOptions, NodeModel } from '@minoru/react-dnd-treeview'

export type TreeNodeData = {
  isNeonat: boolean
  isMoveable: boolean
  order?: number
}

export type TreeNodeModel = NodeModel<TreeNodeData>
export type TreeNodeOptions = DropOptions<TreeNodeData>

export type GetPipeHeightProps = {
  id: string | number
  treeData: Array<TreeNodeModel>
  depth: number
}

export type TreeNodeComponent = FC<{
  node: TreeNodeModel
  depth: number
  isOpen: boolean
  hasChild: boolean
  isDropTarget: boolean
  treeData: Array<TreeNodeModel>
  onClick: (id: TreeNodeModel['id']) => void
  getPipeHeight: ({ id, treeData, depth }: GetPipeHeightProps) => number
}>
