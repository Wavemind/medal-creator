/**
 * The external imports
 */
import isString from 'lodash/isString'

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
  readonly COMPLAINT_CATEGORY = 'complaint_categories_step' // TODO REPLACE WITH ENUM WHEN CODEGEN IS UP

  public static getInstance(): TreeOrdering {
    if (!TreeOrdering.instance) {
      TreeOrdering.instance = new TreeOrdering()
    }
    return TreeOrdering.instance
  }

  /**
   * Reorders an array of TreeNodeModel by moving an element from sourceIndex to targetIndex
   * @param array - the array to reorder
   * @param sourceIndex - the index of the element to move
   * @param targetIndex - the index to move the element to
   * @returns a new array with the element moved
   */
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

  /**
   * Determines if a node can be dropped onto another node
   * @param source - the node being dragged
   * @param destination - the node being dropped onto
   * @returns true if the node can be dropped onto the destination, false otherwise
   */
  public canDrop(source: TreeNodeModel, destination: TreeNodeModel): boolean {
    return source.parent === destination.id
  }

  /**
   * Determines if a node can be dragged
   * @param node - the node being dragged
   * @returns true if the node can be dragged, false otherwise
   */
  public canDrag(node: TreeNodeModel): boolean {
    if (node.data) {
      return node.data.isMoveable
    }
    return false
  }

  /**
   * Determines if a variable is used in a node
   * @param node - the node to check
   * @param usedVariables - an array of used variable IDs
   * @returns true if the variable is used in the node, false otherwise
   */
  public isVariableUsed(node: TreeNodeModel, usedVariables: number[]): boolean {
    if (typeof node.id === 'number') {
      return usedVariables.includes(node.id)
    }
    return false
  }

  /**
   * Determines the subtitle for a node
   * @param node - the node to check
   * @returns the subtitle string if the node is eligible for a subtitle, undefined otherwise
   */
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

  /**
   * Determines if more infromation is available for a node
   * @param node - the node to check
   * @returns true if information is available, false otherwise
   */
  public isInfoAvailable(node: TreeNodeModel): boolean {
    return !isString(node.id)
  }
}

export default TreeOrdering.getInstance()
