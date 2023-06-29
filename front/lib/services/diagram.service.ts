/**
 * The external imports
 */
import { MarkerType } from 'reactflow'

/**
 * The internal imports
 */
import { DiagramType, VariableCategoryEnum } from '../config/constants'
import { VariableService } from './variable.service'

class Diagram {
  private static instance: Diagram

  readonly DEFAULT_EDGE_OPTIONS = {
    markerEnd: {
      type: MarkerType.ArrowClosed,
      color: 'black',
    },
  }

  public static getInstance(): Diagram {
    if (!Diagram.instance) {
      Diagram.instance = new Diagram()
    }
    return Diagram.instance
  }

  /**
   * Transform value to to instanceable value for diagram
   * @param value of diagram type defined by nextjs route
   * @returns DiagramType
   */
  public getInstanceableType = (value: string): DiagramType | null => {
    switch (value) {
      case 'decision-tree':
        return DiagramType.DecisionTree
      case 'algorithm':
        return DiagramType.Algorithm
      case 'node':
        return DiagramType.Node
      default:
        return null
    }
  }

  /**
   * Return the diagram node type based on node type in DB
   * @param value
   * @returns diagram node type
   */
  public getDiagramNodeType = (
    value: VariableCategoryEnum | string
  ): string | undefined => {
    if (VariableService.categories.includes(value)) {
      return 'variable'
    }

    if (value === 'Diagnosis') {
      return 'diagnosis'
    }

    console.log('Unknown node type: ', value)

    return 'medicalCondition'
  }
}

export const DiagramService = Diagram.getInstance()
