/**
 * The external imports
 */
import React, { useCallback, useContext } from 'react'
import { Menu, MenuButton, Button, MenuList, MenuItem } from '@chakra-ui/react'
import { BsPlus } from 'react-icons/bs'
import { ChevronDownIcon } from '@chakra-ui/icons'
import { useTranslation } from 'next-i18next'
import { useReactFlow } from 'reactflow'

/**
 * The internal imports
 */
import { DiagnosisForm, VariableStepper } from '@/components'
import { useCreateInstanceMutation } from '@/lib/api/modules'
import { useAppRouter } from '@/lib/hooks'
import { ModalContext } from '@/lib/contexts'
import { FormEnvironments } from '@/lib/config/constants'
import { InstantiatedNode, type DiagramTypeComponent } from '@/types'
import { DiagramService } from '@/lib/services'

const AddNodeButton: DiagramTypeComponent = ({ diagramType }) => {
  const reactFlowInstance = useReactFlow()
  const { t } = useTranslation('diagram')

  const { open: openModal } = useContext(ModalContext)

  const {
    query: { instanceableId, projectId },
  } = useAppRouter()

  const [createInstance] = useCreateInstanceMutation()

  // TODO: Fix type
  /**
   * Callback to add node after a successfull diagnosis or variable creation
   * @param node InstantiatedNode
   */
  const addNodetoDiagram = async (node: InstantiatedNode): Promise<void> => {
    // TODO : Don't need to create instance for diagnosis
    if (node.category !== 'diagnosis') {
      const createInstanceResponse = await createInstance({
        instanceableType: diagramType,
        instanceableId: instanceableId,
        nodeId: node.id,
        positionX: 100,
        positionY: 100,
      })
    }

    if ('data' in createInstanceResponse || node.category !== 'diagnosis') {
      const type = DiagramService.getDiagramNodeType(node.category)
      reactFlowInstance.addNodes({
        id: node.id,
        data: {
          id: node.id,
          instanceId:
            node.category === 'diagnosis'
              ? node.instance.id
              : createInstanceResponse?.data?.instance.id,
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

  const openVariableForm = useCallback(() => {
    openModal({
      content: (
        <VariableStepper
          projectId={projectId}
          formEnvironment={FormEnvironments.DecisionTreeDiagram}
          callback={addNodetoDiagram}
        />
      ),
      size: '5xl',
    })
  }, [])

  const openDiagnosisForm = useCallback(() => {
    openModal({
      title: t('new', { ns: 'diagnoses' }),
      content: (
        <DiagnosisForm
          decisionTreeId={instanceableId}
          projectId={projectId}
          callback={addNodetoDiagram}
        />
      ),
    })
  }, [])

  const openMedicalConditionForm = useCallback(() => {
    console.log('adding a medicalCondition')
  }, [])

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
        <MenuItem onClick={openDiagnosisForm}>{t('add.diagnosis')}</MenuItem>
      </MenuList>
    </Menu>
  )
}

export default AddNodeButton
