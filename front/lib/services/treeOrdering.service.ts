/**
 * The internal imports
 */
import type { TreeNodeModel } from '@/types/tree'

class TreeOrdering {
  private static instance: TreeOrdering
  readonly TREE_X_OFFSET = 22

  public static getInstance(): TreeOrdering {
    if (!TreeOrdering.instance) {
      TreeOrdering.instance = new TreeOrdering()
    }
    return TreeOrdering.instance
  }

  public reorder(
    array: TreeNodeModel[],
    sourceIndex: number,
    targetIndex: number
  ): TreeNodeModel[] {
    const newArray = [...array]
    const element = newArray.splice(sourceIndex, 1)[0]
    newArray.splice(targetIndex, 0, element)
    return newArray
  }

  public canDrop(source: TreeNodeModel, destination: TreeNodeModel): boolean {
    return source.parent === destination.id
  }

  public canDrag(node: TreeNodeModel): boolean {
    if (node.data) {
      return node.data.isMoveable
    }
    return false
  }
}

export const TreeOrderingService = TreeOrdering.getInstance()
