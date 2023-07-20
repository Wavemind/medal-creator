/**
 * The external imports
 */
import { MarkerType } from 'reactflow'
import type { DefaultTFuncReturn } from 'i18next'

/**
 * The internal imports
 */
import { VariableService } from './variable.service'
import themeColors from '@/lib/theme/foundations/colors'
import {
  DiagramEnum,
  VariableCategoryEnum,
  type CustomTFunction,
} from '@/types'

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

  public readableDate = (ageInDays: number, t: CustomTFunction<'common'>) => {
    let readableDate: DefaultTFuncReturn = ''

    if (ageInDays < 7) {
      readableDate = t('date.days', {
        ns: 'common',
        count: ageInDays,
      })
    }

    if (ageInDays >= 7 && ageInDays < 31) {
      readableDate = t('date.weeks', {
        ns: 'common',
        count: Math.floor(ageInDays / 7),
      })
    }

    if (ageInDays >= 31 && ageInDays < 730) {
      readableDate = t('date.months', {
        ns: 'common',
        count: Math.floor(ageInDays / 30.4375),
      })
    }

    if (ageInDays > 730) {
      readableDate = t('date.years', {
        ns: 'common',
        count: Math.floor(ageInDays / 365.25),
      })
    }

    return readableDate
  }
}

export const DiagramService = Diagram.getInstance()
