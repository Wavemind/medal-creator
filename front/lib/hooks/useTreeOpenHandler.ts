/**
 * The external imports
 */
import { useRef, useState } from 'react'
import {
  getDescendants,
  NodeModel,
  TreeMethods,
} from '@minoru/react-dnd-treeview'

/**
 * The internal imports
 */
import { TreeOrderingService } from '@/lib/services'
import type { GetPipeHeightProps } from '@/types'

export const useTreeOpenHandler = () => {
  const ref = useRef<TreeMethods | null>(null)

  const [openIds, setOpenIds] = useState<(string | number)[]>([])

  const open = (id: number | string) => {
    ref.current?.open(id)
    setOpenIds(p => {
      return p.includes(id) ? p : [...p, id]
    })
  }
  const close = (id: number | string) => {
    ref.current?.close(id)
    setOpenIds(p => {
      return [...p.filter(v => v !== id)]
    })
  }
  const toggle = (id: number | string) => {
    openIds.includes(id) ? close(id) : open(id)
  }

  const isVisible = (id: number | string, treeData: NodeModel[]): boolean => {
    const parentId = treeData.find(node => node.id === id)?.parent
    const parentExistsInTree =
      parentId && treeData.find(node => node.id === parentId)
    if (parentExistsInTree) {
      const isParentVisible = openIds.includes(parentId)
      return isParentVisible ? isVisible(parentId, treeData) : false
    } else {
      return true
    }
  }

  const getPipeHeight = ({ id, treeData, depth }: GetPipeHeightProps) => {
    treeData = getDescendants(treeData, id)

    const { ROW_HEIGHT_PX, LIST_PADDING_PX } = TreeOrderingService

    const droppableHeightExceedsRow = (node: NodeModel) =>
      node?.droppable &&
      openIds.includes(node.id) &&
      treeData.filter(n => n.parent === node.id).length > 0

    const getHeightOfId = (id: number | string): number => {
      const directChildren = treeData.filter(node => node.parent === id)
      const heightOfChildren = directChildren.map(node =>
        droppableHeightExceedsRow(node)
          ? getHeightOfId(node.id) + ROW_HEIGHT_PX + LIST_PADDING_PX
          : ROW_HEIGHT_PX + LIST_PADDING_PX
      )
      const height = heightOfChildren.reduce((a, b) => a + b, 0)
      return height
    }

    const lastChild = treeData.filter(node => node.parent === id).reverse()[0]
    if (droppableHeightExceedsRow(lastChild)) {
      if (depth === 0) {
        return (
          getHeightOfId(id) -
          getHeightOfId(lastChild.id) -
          LIST_PADDING_PX -
          ROW_HEIGHT_PX
        )
      }
      return getHeightOfId(id) - getHeightOfId(lastChild.id) - LIST_PADDING_PX
    }

    if (depth === 0) {
      return getHeightOfId(id) - ROW_HEIGHT_PX
    }

    return getHeightOfId(id) - ROW_HEIGHT_PX / 2
  }

  return { ref, open, close, toggle, getPipeHeight, isVisible, openIds }
}
