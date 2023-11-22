/**
 * The external imports
 */
import { useEffect, useMemo } from 'react'
import { Edge, useReactFlow } from 'reactflow'
import { skipToken } from '@reduxjs/toolkit/dist/query'
import { useTranslation } from 'next-i18next'

/**
 * The internal imports
 */
import {
  type CreateDiagnosis,
  useGetDiagnosisQuery,
} from '@/lib/api/modules/enhanced/diagnosis.enhanced'
import { useGetDecisionTreeQuery } from '@/lib/api/modules/enhanced/decisionTree.enhanced'
import { useAppRouter, useToast } from '@/lib/hooks'
import {
  CreateInstance,
  useCreateInstanceMutation,
} from '@/lib/api/modules/enhanced/instance.enhanced'
import DiagramService from '@/lib/services/diagram.service'
import { DiagramContext } from '@/lib/contexts'
import {
  DiagramEnum,
  type UpdatableNodeValues,
  type InstantiatedNode,
  type DiagramProviderProps,
  DefaultInstanceProps,
} from '@/types'
import type { CreateInstanceMutationVariables } from '@/lib/api/modules/generated/instance.generated'

const DiagramProvider: DiagramProviderProps = ({ children, diagramType }) => {
  const { t } = useTranslation('common')
  const { addNodes } = useReactFlow<InstantiatedNode, Edge>()

  const { newToast } = useToast()

  const {
    query: { instanceableId },
  } = useAppRouter()

  const [createInstance, { isError }] = useCreateInstanceMutation()

  const { data: diagnosis, isSuccess: isGetDiagnosisSuccess } =
    useGetDiagnosisQuery(
      diagramType === DiagramEnum.Diagnosis ? { id: instanceableId } : skipToken
    )

  const { data: decisionTree, isSuccess: isGetDecisionTreeSuccess } =
    useGetDecisionTreeQuery(
      diagramType === DiagramEnum.DecisionTree
        ? { id: instanceableId }
        : skipToken
    )

  const decisionTreeId = useMemo(() => {
    if (isGetDecisionTreeSuccess) {
      return decisionTree.id
    }
    if (isGetDiagnosisSuccess) {
      return diagnosis.decisionTreeId
    }
  }, [isGetDecisionTreeSuccess, isGetDiagnosisSuccess])

  // TODO: RENAME IT
  // TODO: FETCH X AND Y FROM CREATE INSTANCE
  const addVariableToDiagram = async (
    node: UpdatableNodeValues
  ): Promise<void> => {
    const createInstanceResponse = await generateInstance({ nodeId: node.id })

    if (createInstanceResponse) {
      addNodeInDiagram(node, createInstanceResponse.instance.id)
    }
  }

  const addNodeInDiagram = async (
    node: UpdatableNodeValues,
    instanceId: string
  ) => {
    const type = DiagramService.getDiagramNodeType(node.category)
    addNodes({
      id: node.id,
      data: {
        id: node.id,
        fullReference: node.fullReference,
        instanceId: instanceId,
        category: node.category,
        isNeonat: node.isNeonat,
        excludingNodes: node.excludingNodes || [],
        labelTranslations: node.labelTranslations,
        diagramAnswers: node.diagramAnswers || [],
      },
      position: {
        x: 100,
        y: 100,
      },
      type,
    })
  }

  const generateInstance = ({
    nodeId,
    positionX = 100,
    positionY = 100,
  }: DefaultInstanceProps): Promise<CreateInstance> => {
    const createInstanceVariables: CreateInstanceMutationVariables = {
      nodeId,
      positionX,
      positionY,
      instanceableId: '',
      instanceableType: DiagramEnum.DecisionTree,
    }

    if (diagramType === DiagramEnum.DecisionTree) {
      createInstanceVariables.instanceableType = diagramType
      createInstanceVariables.instanceableId = instanceableId
    } else {
      createInstanceVariables.instanceableType = DiagramEnum.DecisionTree
      createInstanceVariables.instanceableId = diagnosis!.decisionTreeId
      createInstanceVariables.diagnosisId = instanceableId
    }

    return createInstance(createInstanceVariables).unwrap()
  }

  const addDiagnosisToDiagram = async (
    instance: CreateDiagnosis
  ): Promise<void> => {
    if (instance) {
      const type = DiagramService.getDiagramNodeType(instance.node.category)
      addNodes({
        id: instance.node.id,
        data: {
          id: instance.node.id,
          fullReference: instance.node.fullReference,
          instanceId: instance.id,
          category: instance.node.category,
          isNeonat: instance.node.isNeonat,
          excludingNodes: instance.node.excludingNodes,
          labelTranslations: instance.node.labelTranslations,
          diagramAnswers: instance.node.diagramAnswers,
        },
        position: {
          x: 100,
          y: 100,
        },
        type,
      })
    }
  }

  useEffect(() => {
    if (isError) {
      newToast({
        message: t('errorBoundary.generalError'),
        status: 'error',
      })
    }
  }, [isError])

  return (
    <DiagramContext.Provider
      value={{
        generateInstance,
        addVariableToDiagram,
        addNodeInDiagram,
        addDiagnosisToDiagram,
        diagramType,
        decisionTreeId,
      }}
    >
      {children}
    </DiagramContext.Provider>
  )
}

export default DiagramProvider
