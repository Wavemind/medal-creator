/**
 * The external imports
 */
import { isString } from 'lodash'

/**
 * The internal imports
 */
import type { TreeNodeModel } from '@/types/tree'

class TreeOrdering {
  private static instance: TreeOrdering
  readonly TREE_X_OFFSET_PX = 96
  readonly ROW_HEIGHT_PX = 56
  readonly LIST_PADDING_PX = 12
  readonly CIRCLE_WIDTH_PX = 32
  readonly DOT_WIDTH_PX = 8
  readonly PIPE_WIDTH_PX = 2
  readonly COMPLAINT_CATEGORY = 'complaint_categories_step'

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

  public isVariableUsed(node: TreeNodeModel, usedVariables: number[]): boolean {
    if (typeof node.id === 'number') {
      return usedVariables.includes(node.id)
    }
    return false
  }

  public subtitle(node: TreeNodeModel): string | undefined {
    if (node.parent === this.COMPLAINT_CATEGORY) {
      return 'attribute'
    }

    if (node.parent === 0) {
      return 'step'
    }

    if (
      typeof node.parent === 'string' &&
      node.parent !== this.COMPLAINT_CATEGORY &&
      node.droppable
    ) {
      return 'system'
    }
  }

  public isInfoAvailable(node: TreeNodeModel): boolean {
    return !isString(node.id)
  }
}

export const TreeOrderingService = TreeOrdering.getInstance()
