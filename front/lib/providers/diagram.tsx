/**
 * The external imports
 */
import { useEffect, useMemo, useState } from 'react'
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
import { useAppRouter } from '@/lib/hooks/useAppRouter'
import { useToast } from '@/lib/hooks/useToast'
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
  type DefaultInstanceProps,
} from '@/types'
import type { CreateInstanceMutationVariables } from '@/lib/api/modules/generated/instance.generated'
import { useProject } from '../hooks/useProject'

const DiagramProvider: DiagramProviderProps = ({
  children,
  diagramType,
  isRestricted,
}) => {
  const [refetchNodes, setRefetchNodes] = useState(false)
  const { isAdminOrClinician } = useProject()

  const { t } = useTranslation('common')
  const { addNodes } = useReactFlow<InstantiatedNode, Edge>()

  const { newToast } = useToast()

  const isEditable = useMemo(() => {
    return isAdminOrClinician && !isRestricted
  }, [isAdminOrClinician, isRestricted])

  const {
    query: { instanceableId },
  } = useAppRouter()

  const [createInstance, { isError }] = useCreateInstanceMutation()

  const { data: diagnosis, isSuccess: isGetDiagnosisSuccess } =
    useGetDiagnosisQuery(
      diagramType === DiagramEnum.Diagnosis ? { id: instanceableId } : skipToken
    )

  const convertedInstanceableId = useMemo(() => {
    if (
      [
        DiagramEnum.Algorithm,
        DiagramEnum.DecisionTree,
        DiagramEnum.QuestionsSequence,
        DiagramEnum.QuestionsSequenceScored,
      ].includes(diagramType)
    ) {
      return instanceableId
    }
    if (isGetDiagnosisSuccess) {
      return diagnosis.decisionTreeId
    }
  }, [isGetDiagnosisSuccess])

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

    if (
      [
        DiagramEnum.Algorithm,
        DiagramEnum.DecisionTree,
        DiagramEnum.QuestionsSequence,
        DiagramEnum.QuestionsSequenceScored,
      ].includes(diagramType)
    ) {
      createInstanceVariables.instanceableType = diagramType
      createInstanceVariables.instanceableId = convertedInstanceableId!
    } else {
      createInstanceVariables.instanceableType = DiagramEnum.DecisionTree
      createInstanceVariables.instanceableId = convertedInstanceableId!
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
        setRefetchNodes,
        refetchNodes,
        generateInstance,
        addVariableToDiagram,
        addNodeInDiagram,
        addDiagnosisToDiagram,
        diagramType,
        convertedInstanceableId,
        isEditable,
      }}
    >
      {children}
    </DiagramContext.Provider>
  )
}

export default DiagramProvider
