/**
 * The external imports
 */
import { useCallback, useContext } from 'react'
import { Menu, MenuButton, Button, MenuList, MenuItem } from '@chakra-ui/react'
import { BsPlus } from 'react-icons/bs'
import { ChevronDownIcon } from '@chakra-ui/icons'
import { useTranslation } from 'next-i18next'
import { useReactFlow } from 'reactflow'

/**
 * The internal imports
 */
import { DiagnosisForm, VariableStepper } from '@/components'
import { CreateDiagnosis, useCreateInstanceMutation } from '@/lib/api/modules'
import { useAppRouter } from '@/lib/hooks'
import { ModalContext } from '@/lib/contexts'
import { FormEnvironments } from '@/lib/config/constants'
import { InstantiatedNode } from '@/types'
import { DiagramService } from '@/lib/services'
import type { DiagramTypeComponent } from '@/types'

const AddNodeMenu: DiagramTypeComponent = ({ diagramType }) => {
  const { addNodes } = useReactFlow()
  const { t } = useTranslation('diagram')

  const { open: openModal } = useContext(ModalContext)

  const {
    query: { instanceableId, projectId },
  } = useAppRouter()

  const [createInstance] = useCreateInstanceMutation()

  /**
   * Callback to add node in diagram after a successfull creation in DB
   * @param node InstantiatedNode
   */
  const addVariableToDiagram = async (
    node: InstantiatedNode
  ): Promise<void> => {
    const createInstanceResponse = await createInstance({
      instanceableType: diagramType,
      instanceableId: instanceableId,
      nodeId: node.id,
      positionX: 100,
      positionY: 100,
    })

    if ('data' in createInstanceResponse && createInstanceResponse.data) {
      const type = DiagramService.getDiagramNodeType(node.category)
      addNodes({
        id: node.id,
        data: {
          id: node.id,
          instanceId: createInstanceResponse?.data?.instance.id,
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
          projectId={projectId}
          formEnvironment={FormEnvironments.DecisionTreeDiagram}
          callback={addVariableToDiagram}
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
          callback={addDiagnosisToDiagram}
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

export default AddNodeMenu
