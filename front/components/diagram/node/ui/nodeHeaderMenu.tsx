/**
 * The external imports
 */
import { memo, useMemo } from 'react'
import {
  Menu,
  MenuButton,
  IconButton,
  MenuList,
  MenuItem,
} from '@chakra-ui/react'
import { useTranslation } from 'next-i18next'
import { useNodeId, useReactFlow } from 'reactflow'
import type { Edge } from 'reactflow'

/**
 * The internal imports
 */
import EditIcon from '@/assets/icons/Edit'
import SettingsIcon from '@/assets/icons/Settings'
import DiagnosisForm from '@/components/forms/diagnosis'
import VariableInstances from '@/components/modal/variableInstances'
import VariableStepper from '@/components/forms/variableStepper'
import { useAppRouter } from '@/lib/hooks/useAppRouter'
import { useDiagram } from '@/lib/hooks/useDiagram'
import { useModal } from '@/lib/hooks/useModal'
import { DiagramNodeTypeEnum } from '@/lib/config/constants'
import QuestionSequencesForm from '@/components/forms/questionsSequence'
import AlgorithmsIcon from '@/assets/icons/Algorithms'
import InformationIcon from '@/assets/icons/Information'
import DrugStepper from '@/components/forms/drugStepper'
import ManagementForm from '@/components/forms/management'
import InstanceForm from '@/components/forms/instance'
import {
  DiagramEnum,
  QuestionsSequenceCategoryEnum,
  type InstantiatedNode,
  type NodeHeaderMenuComponent,
  type UpdatableNodeValues,
} from '@/types'

const NodeHeaderMenu: NodeHeaderMenuComponent = ({
  color,
  isOpen,
  onOpen,
  onClose,
}) => {
  const { t } = useTranslation('common')

  const { open: openModal } = useModal()
  const { convertedInstanceableId, diagramType } = useDiagram()
  const {
    query: { projectId, instanceableId },
  } = useAppRouter()

  const { getNode, setNodes } = useReactFlow<InstantiatedNode, Edge>()
  const nodeId = useNodeId()

  const node = useMemo(() => {
    if (nodeId) {
      return getNode(nodeId)
    }
  }, [nodeId])

  /**
   * Handle update of the node by opening the correct form modal
   */
  const handleEdit = (): void => {
    if (node) {
      switch (node.type) {
        case DiagramNodeTypeEnum.Diagnosis:
          openModal({
            title: t('edit', { ns: 'diagnoses' }),
            content: (
              <DiagnosisForm
                diagnosisId={node.data.id}
                callback={updateNodeInDiagram}
              />
            ),
            size: '5xl',
          })
          break
        case DiagramNodeTypeEnum.MedicalCondition:
          openModal({
            title: t('edit', { ns: 'questionsSequence' }),
            content: (
              <QuestionSequencesForm
                questionsSequenceId={node.data.id}
                callback={updateNodeInDiagram}
              />
            ),
            size: '5xl',
          })
          break
        case DiagramNodeTypeEnum.Variable:
          openModal({
            content: (
              <VariableStepper
                variableId={node.data.id}
                formEnvironment={diagramType}
                callback={updateNodeInDiagram}
              />
            ),
            size: '5xl',
          })
          break
        case DiagramNodeTypeEnum.Drug:
          openModal({
            content: (
              <DrugStepper
                drugId={node.data.id}
                callback={updateNodeInDiagram}
              />
            ),
            size: '5xl',
          })
          break
        case DiagramNodeTypeEnum.Management:
          openModal({
            content: (
              <ManagementForm
                managementId={node.data.id}
                callback={updateNodeInDiagram}
              />
            ),
            size: '5xl',
          })
          break
      }
    }
  }

  const handleEditInstance = (): void => {
    if (node && convertedInstanceableId) {
      openModal({
        title: t('setProperties', { ns: 'instances' }),
        content: (
          <InstanceForm
            instanceId={node.data.instanceId}
            nodeId={node.data.id}
            callback={updateNodeInDiagram}
            instanceableId={convertedInstanceableId}
            instanceableType={DiagramEnum.DecisionTree}
          />
        ),
        size: '5xl',
      })
    }
  }

  const updateNodeInDiagram = (updatedNode: UpdatableNodeValues): void => {
    setNodes(nds =>
      nds.map(node => {
        if (node.id === updatedNode.id) {
          node.data = {
            ...node.data,
            category: updatedNode.category,
            isNeonat: updatedNode.isNeonat,
            labelTranslations: updatedNode.labelTranslations,
            diagramAnswers: updatedNode.diagramAnswers || [],
            minScore: updatedNode.minScore,
          }
        }

        return node
      })
    )
  }

  const handleSeeUses = (): void => {
    if (node) {
      openModal({
        title: t('uses', { ns: 'variables' }),
        content: <VariableInstances variableId={node.id} />,
        size: '5xl',
      })
    }
  }

  const handleOpenDiagram = (): void => {
    if (node) {
      if (node.type === DiagramNodeTypeEnum.Diagnosis) {
        window.open(
          `/projects/${projectId}/diagram/diagnosis/${node.id}`,
          '_ blank'
        )
      }

      if (node.data.category === QuestionsSequenceCategoryEnum.Scored) {
        window.open(
          `/projects/${projectId}/diagram/questions-sequence-scored/${node.id}`,
          '_ blank'
        )
      }

      if (
        [
          QuestionsSequenceCategoryEnum.Comorbidity,
          QuestionsSequenceCategoryEnum.PredefinedSyndrome,
          QuestionsSequenceCategoryEnum.Triage,
        ].includes(node.data.category as QuestionsSequenceCategoryEnum)
      ) {
        window.open(
          `/projects/${projectId}/diagram/questions-sequence/${node.id}`,
          '_ blank'
        )
      }
    }
  }

  if (node) {
    return (
      <Menu isLazy isOpen={isOpen} onOpen={onOpen} onClose={onClose}>
        <MenuButton
          as={IconButton}
          isRound
          aria-label='Options'
          icon={<SettingsIcon color={color} />}
          variant='secondary'
          p={0}
          h={5}
        />
        <MenuList>
          {[
            DiagramNodeTypeEnum.Diagnosis,
            DiagramNodeTypeEnum.MedicalCondition,
          ].includes(node.type as DiagramNodeTypeEnum) &&
            node.id !== instanceableId && (
              <MenuItem
                onClick={handleOpenDiagram}
                icon={<AlgorithmsIcon boxSize={6} />}
              >
                {t(
                  DiagramNodeTypeEnum.Diagnosis === node.type
                    ? 'openTreatment'
                    : 'openDiagram',
                  { ns: 'datatable' }
                )}
              </MenuItem>
            )}
          <MenuItem onClick={handleSeeUses} icon={<InformationIcon />}>
            {t('seeUses')}
          </MenuItem>
          {!node.data.isDefault && (
            <MenuItem onClick={handleEdit} icon={<EditIcon />}>
              {t('edit')}
            </MenuItem>
          )}
          {node.type === DiagramNodeTypeEnum.Drug && (
            <MenuItem onClick={handleEditInstance} icon={<EditIcon />}>
              {t('editInstance')}
            </MenuItem>
          )}
        </MenuList>
      </Menu>
    )
  }

  return null
}

export default memo(NodeHeaderMenu)
