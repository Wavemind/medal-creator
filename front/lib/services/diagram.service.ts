/**
 * The external imports
 */
import { MarkerType } from 'reactflow'
import type { DefaultTFuncReturn } from 'i18next'
import type { Connection, ReactFlowInstance, Edge, Node } from 'reactflow'

/**
 * The internal imports
 */
import VariableService from '@/lib/services/variable.service'
import themeColors from '@/lib/theme/foundations/colors'
import {
  AlgorithmAvailableCategoriesEnum,
  DecisionTreeAvailableCategoriesEnum,
  DiagnosisAvailableCategoriesEnum,
  QuestionsSequenceAvailableCategoriesEnum,
  QuestionsSequenceScoredAvailableCategoriesEnum,
  DiagramEnum,
  InstantiatedNode,
  VariableCategoryEnum,
  type CustomTFunction,
  type Option,
} from '@/types'
import {
  MONTH_DURATION,
  WEEK_DURATION,
  YEAR_DURATION,
} from '@/lib/config/constants'

class Diagram {
  private static instance: Diagram
  readonly DEFAULT_AVAILABLE_NODES_PER_PAGE = 30
  readonly CATEGORY_PER_DIAGRAM: Record<DiagramEnum, string[]> = {
    [DiagramEnum.Algorithm]: Object.values(AlgorithmAvailableCategoriesEnum),
    [DiagramEnum.DecisionTree]: Object.values(
      DecisionTreeAvailableCategoriesEnum
    ),
    [DiagramEnum.Diagnosis]: Object.values(DiagnosisAvailableCategoriesEnum),
    [DiagramEnum.QuestionsSequence]: Object.values(
      QuestionsSequenceAvailableCategoriesEnum
    ),
    [DiagramEnum.QuestionsSequenceScored]: Object.values(
      QuestionsSequenceScoredAvailableCategoriesEnum
    ),
  }

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
      case 'diagnosis':
        return DiagramEnum.Diagnosis
      case 'questions-sequence':
        return DiagramEnum.QuestionsSequence
      case 'question-seequence-scored':
        return DiagramEnum.QuestionsSequenceScored
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

  /**
   * Validates the connection
   * @param connection Connection
   * @returns boolean
   */
  public isValidConnection = (
    connection: Connection | Edge,
    reactFlowInstance: ReactFlowInstance<InstantiatedNode, Edge>
  ): boolean => {
    if (connection && connection.source && connection.target) {
      const source = reactFlowInstance.getNode(connection.source)
      const target = reactFlowInstance.getNode(connection.target)

      if (source && target) {
        // If a diagnosis node tries to connect to a non diagnosis node
        if (source.type === 'diagnosis' && target.type !== 'diagnosis') {
          return false
        }

        // If the source and the target are the same node
        if (source.data.id === target.data.id) {
          return false
        }

        return true
      }
    }

    return false
  }

  /**
   * Get the color of the node for the minimap
   * @param node Provide the node to get the color
   * @returns The color of the node
   */
  public getNodeColorByType = (node: Node): string => {
    switch (node.type) {
      case 'diagnosis':
        return themeColors.colors.secondary
      case 'medicalCondition':
        return themeColors.colors.primary
      default:
        return themeColors.colors.diagram.variable
    }
  }

  /**
   * Transform age in days in a readable way
   * @param ageInDays age to display in days
   * @param t translations function
   * @returns readable date in correct language
   */
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
        count: Math.floor(ageInDays / WEEK_DURATION),
      })
    }

    if (ageInDays >= 31 && ageInDays <= 730) {
      readableDate = t('date.months', {
        ns: 'common',
        count: Math.floor(ageInDays / MONTH_DURATION),
      })
    }

    if (ageInDays > 730) {
      readableDate = t('date.years', {
        ns: 'common',
        count: Math.floor(ageInDays / YEAR_DURATION),
      })
    }

    return readableDate
  }

  /**
   * Returns the options for the category filter based on the specified diagram type.
   * @param diagramType The type of the diagram.
   * @param t The translation function for i18next.
   * @returns An array of Option objects representing the category filter options.
   */

  public categoryFilterOptions = (
    diagramType: DiagramEnum,
    t: CustomTFunction<'variable'>
  ): Option[] =>
    this.CATEGORY_PER_DIAGRAM[diagramType].map(category => ({
      value: category,
      label: t(`categories.${category}.label`, {
        ns: 'variables',
        defaultValue: '',
      }),
    }))
}

export default Diagram.getInstance()
