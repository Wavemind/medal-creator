/**
 * The external imports
 */
import { MarkerType } from 'reactflow'

/**
 * The internal imports
 */
import { VariableService } from './variable.service'
import themeColors from '@/lib/theme/foundations/colors'
import { DiagramEnum, VariableCategoryEnum } from '@/types'

class Diagram {
  private static instance: Diagram

  readonly DEFAULT_EDGE_OPTIONS = {
    style: {
      stroke: themeColors.colors.primary,
    },
    markerEnd: {
      type: MarkerType.ArrowClosed,
      color: themeColors.colors.primary,
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
  public getInstanceableType = (value: string): DiagramEnum | null => {
    switch (value) {
      case 'decision-tree':
        return DiagramEnum.DecisionTree
      case 'algorithm':
        return DiagramEnum.Algorithm
      case 'node':
        return DiagramEnum.Node
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

    return 'medicalCondition'
  }
}

export const DiagramService = Diagram.getInstance()
