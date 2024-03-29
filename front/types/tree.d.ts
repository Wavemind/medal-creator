/**
 * The external imports
 */
import type { FC } from 'react'
import type { DropOptions, NodeModel } from '@minoru/react-dnd-treeview'
import type { BoxProps } from '@chakra-ui/react'

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
  usedVariables: number[]
  node: TreeNodeModel
  depth: number
  isOpen: boolean
  hasChild: boolean
  treeData: Array<TreeNodeModel>
  onClick: (id: TreeNodeModel['id']) => void
  getPipeHeight: ({ id, treeData, depth }: GetPipeHeightProps) => number
  enableDnd: boolean
}>

export type PipeComponent = FC<
  BoxProps & {
    orientation: 'horizontal' | 'vertical'
    depth?: number
  }
>

export type ItemComponent = FC<{
  usedVariables: number[]
  enableDnd: boolean
  node: TreeNodeModel
}>

export type PreviewComponent = FC<{
  node: TreeNodeModel
}>
