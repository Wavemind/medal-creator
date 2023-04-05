/**
 * The external imports
 */
import type { FC } from 'react'
import type { DropOptions, NodeModel } from '@minoru/react-dnd-treeview'

export type TreeNodeData = {
  isNeonat: boolean
  isMoveable: boolean
}

export type TreeNodeModel = NodeModel<TreeNodeData>
export type TreeNodeOptions = DropOptions<TreeNodeData>

export type TreeNodeComponent = FC<{
  node: TreeNodeModel
  depth: number
  isOpen: boolean
  hasChild: boolean
  isDropTarget: boolean
  treeData: TreeNodeModel[]
  onClick: (id: TreeNodeModel['id']) => void
  getPipeHeight: (id: string | number, treeData: TreeNodeModel[]) => number
}>
