/**
 * The external imports
 */
import { memo } from 'react'
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
import DuplicateIcon from '@/assets/icons/Duplicate'
import EditIcon from '@/assets/icons/Edit'
import SettingsIcon from '@/assets/icons/Settings'
import DiagnosisForm from '@/components/forms/diagnosis'
import VariableInstances from '@/components/modal/variableInstances'
import VariableStepper from '@/components/forms/variableStepper'
import { useAppRouter, useModal } from '@/lib/hooks'
import { FormEnvironments } from '@/lib/config/constants'
import type { InstantiatedNode, NodeHeaderMenuComponent } from '@/types'

const NodeHeaderMenu: NodeHeaderMenuComponent = ({
  textColor,
  isOpen,
  onOpen,
  onClose,
}) => {
  const { t } = useTranslation('common')

  const {
    query: { projectId },
  } = useAppRouter()

  const { open: openModal } = useModal()

  const { getNode, setNodes } = useReactFlow<InstantiatedNode, Edge>()
  const nodeId = useNodeId()

  /**
   * Handle update of the node by opening the correct form modal
   */
  const handleEdit = () => {
    if (nodeId) {
      const node = getNode(nodeId)

      if (node) {
        switch (node.type) {
          case 'diagnosis':
            openModal({
              title: t('edit', { ns: 'diagnoses' }),
              content: (
                <DiagnosisForm
                  projectId={projectId}
                  diagnosisId={node.data.id}
                  callback={updateNodeInDiagram}
                />
              ),
            })
            break
          case 'medicalCondition':
            console.log('open medical condition')
            break
          case 'variable':
            openModal({
              content: (
                <VariableStepper
                  projectId={projectId}
                  variableId={node.data.id}
                  formEnvironment={FormEnvironments.DecisionTreeDiagram} // TODO: HAVE TO BE CHECK
                  callback={updateNodeInDiagram}
                />
              ),
              size: '5xl',
            })
        }
      }
    }
  }

  const updateNodeInDiagram = (updatedNode: InstantiatedNode): void => {
    setNodes(nds =>
      nds.map(node => {
        if (node.id === updatedNode.id) {
          node.data = {
            ...node.data,
            category: updatedNode.category,
            isNeonat: updatedNode.isNeonat,
            labelTranslations: updatedNode.labelTranslations,
            diagramAnswers: updatedNode.diagramAnswers,
          }
        }

        return node
      })
    )
  }

  /**
   * Handle opening of the modal to see the uses of the node
   */
  const handleSeeUses = () => {
    if (nodeId) {
      const node = getNode(nodeId)

      if (node) {
        openModal({
          title: t('uses', { ns: 'variables' }),
          content: <VariableInstances variableId={node.id} />,
          size: '4xl',
        })
      }
    }
  }

  return (
    <Menu isLazy isOpen={isOpen} onOpen={onOpen} onClose={onClose}>
      <MenuButton
        as={IconButton}
        isRound
        aria-label='Options'
        icon={<SettingsIcon color={textColor} />}
        variant='secondary'
        p={0}
        h={5}
      />
      <MenuList>
        <MenuItem onClick={handleEdit} icon={<EditIcon />}>
          {t('edit')}
        </MenuItem>
        <MenuItem onClick={handleSeeUses} icon={<DuplicateIcon />}>
          {t('seeUses')}
        </MenuItem>
      </MenuList>
    </Menu>
  )
}

export default memo(NodeHeaderMenu)
