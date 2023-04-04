/**
 * The internal imports
 */
import type { TreeNodeModel } from '@/types/tree'

class TreeOrdering {
  private static instance: TreeOrdering

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

  // TODO ADD MEDAL-C LOGIC
  public canDrop(source: TreeNodeModel, destination: TreeNodeModel): boolean {
    return source.parent === destination.id
  }

  // TODO
  public canDrag(source: TreeNodeModel, destination: TreeNodeModel): boolean {
    return this.canDrop(source, destination)
  }
}

export const TreeOrderingService = TreeOrdering.getInstance()
