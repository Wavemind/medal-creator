/**
 * The external imports
 */
import React, { useCallback } from 'react'
import { Menu, MenuButton, Button, MenuList, MenuItem } from '@chakra-ui/react'
import { BsPlus } from 'react-icons/bs'
import { ChevronDownIcon } from '@chakra-ui/icons'
import { useTranslation } from 'next-i18next'
import { Edge, useReactFlow } from 'reactflow'
import { skipToken } from '@reduxjs/toolkit/dist/query'

/**
 * The internal imports
 */
import DiagnosisForm from '@/components/forms/diagnosis'
import VariableStepper from '@/components/forms/variableStepper'
import {
  CreateDiagnosis,
  useGetDiagnosisQuery,
} from '@/lib/api/modules/enhanced/diagnosis.enhanced'
import { useCreateInstanceMutation } from '@/lib/api/modules/enhanced/instance.enhanced'
import { useAppRouter, useModal } from '@/lib/hooks'
import { FormEnvironments } from '@/lib/config/constants'
import { DiagramEnum, InstantiatedNode } from '@/types'
import DiagramService from '@/lib/services/diagram.service'
import QuestionSequencesForm from '@/components/forms/questionsSequence'
import ManagementForm from '@/components/forms/management'
import DrugStepper from '@/components/forms/drugStepper'
import type { DiagramTypeComponent, UpdatableNodeValues } from '@/types'
import type { CreateInstanceMutationVariables } from '@/lib/api/modules/generated/instance.generated'

const AddNodeMenu: DiagramTypeComponent = ({ diagramType }) => {
  const { addNodes } = useReactFlow<InstantiatedNode, Edge>()
  const { t } = useTranslation('diagram')

  const { open: openModal } = useModal()

  const {
    query: { instanceableId },
  } = useAppRouter()

  const [createInstance] = useCreateInstanceMutation()

  const { data: diagnosis } = useGetDiagnosisQuery(
    diagramType === DiagramEnum.Diagnosis ? { id: instanceableId } : skipToken
  )

  /**
   * Callback to add node in diagram after a successfull creation in DB
   * @param node InstantiatedNode
   */
  const addVariableToDiagram = async (
    node: UpdatableNodeValues
  ): Promise<void> => {
    const createInstanceVariables: CreateInstanceMutationVariables = {
      nodeId: node.id,
      positionX: 100,
      positionY: 100,
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

    const createInstanceResponse = await createInstance(
      createInstanceVariables
    ).unwrap()

    if (createInstanceResponse) {
      const type = DiagramService.getDiagramNodeType(node.category)
      addNodes({
        id: node.id,
        data: {
          id: node.id,
          fullReference: node.fullReference,
          instanceId: createInstanceResponse.instance.id,
          category: node.category,
          isNeonat: node.isNeonat,
          excludingNodes: node.excludingNodes,
          labelTranslations: node.labelTranslations,
          diagramAnswers: node.diagramAnswers,
        },
        position: {
          x: 100,
          y: 100,
        },
        type,
      })
    }
  }

  /**
   * Callback to add diagnosis in diagram after a successfull creation in DB
   * @param instance CreateDiagnosis
   */
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

  const openVariableForm = useCallback(() => {
    openModal({
      content: (
        <VariableStepper
          formEnvironment={FormEnvironments.DecisionTreeDiagram}
          callback={addVariableToDiagram}
        />
      ),
      size: '5xl',
    })
  }, [t])

  const openDiagnosisForm = useCallback(() => {
    openModal({
      title: t('new', { ns: 'diagnoses' }),
      content: (
        <DiagnosisForm
          decisionTreeId={instanceableId}
          callback={addDiagnosisToDiagram}
        />
      ),
    })
  }, [t])

  const openMedicalConditionForm = useCallback(() => {
    openModal({
      title: t('new', { ns: 'questionsSequence' }),
      content: <QuestionSequencesForm callback={addVariableToDiagram} />,
    })
  }, [t])

  const openManagementForm = useCallback(() => {
    openModal({
      title: t('new', { ns: 'managements' }),
      content: <ManagementForm callback={addVariableToDiagram} />,
    })
  }, [t])

  const openDrugForm = useCallback(() => {
    openModal({
      title: t('new', { ns: 'drugs' }),
      content: <DrugStepper callback={addVariableToDiagram} />,
      size: '5xl',
    })
  }, [t])

  return (
    <Menu>
      <MenuButton
        as={Button}
        variant='outline'
        leftIcon={<BsPlus />}
        rightIcon={<ChevronDownIcon />}
      >
        {t('add', { ns: 'common' })}
      </MenuButton>
      <MenuList>
        <MenuItem onClick={openVariableForm}>{t('add.variable')}</MenuItem>
        <MenuItem onClick={openMedicalConditionForm}>
          {t('add.medicalCondition')}
        </MenuItem>
        {diagramType === DiagramEnum.DecisionTree && (
          <MenuItem onClick={openDiagnosisForm}>{t('add.diagnosis')}</MenuItem>
        )}

        {diagramType === DiagramEnum.Diagnosis && (
          <React.Fragment>
            <MenuItem onClick={openManagementForm}>
              {t('add.management')}
            </MenuItem>
            <MenuItem onClick={openDrugForm}>{t('add.drug')}</MenuItem>
          </React.Fragment>
        )}
      </MenuList>
    </Menu>
  )
}

export default AddNodeMenu
