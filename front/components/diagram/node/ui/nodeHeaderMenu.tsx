/**
 * The external imports
 */
import { memo, useContext, useEffect } from 'react'
import {
  Menu,
  MenuButton,
  IconButton,
  MenuList,
  MenuItem,
} from '@chakra-ui/react'
import { useTranslation } from 'next-i18next'
import { type Edge, useNodeId, useReactFlow } from 'reactflow'

/**
 * The internal imports
 */
import {
  DuplicateIcon,
  EditIcon,
  SettingsIcon,
  DeleteIcon,
} from '@/assets/icons'
import { DiagnosisForm, VariableInstances, VariableStepper } from '@/components'
import { useAppRouter, useToast } from '@/lib/hooks'
import { ModalContext } from '@/lib/contexts'
import { useDestroyInstanceMutation } from '@/lib/api/modules'
import type { InstantiatedNode, NodeHeaderMenuComponent } from '@/types'
import { FormEnvironments } from '@/lib/config/constants'

const NodeHeaderMenu: NodeHeaderMenuComponent = ({
  textColor,
  isOpen,
  onOpen,
  onClose,
}) => {
  const { t } = useTranslation('variables')

  const {
    query: { projectId },
  } = useAppRouter()

  const { open: openModal } = useContext(ModalContext)
  const { newToast } = useToast()

  const [destroyInstance, { isError: isDestroyInstanceError }] =
    useDestroyInstanceMutation()

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
          title: t('uses'),
          content: <VariableInstances variableId={node.id} />,
          size: '4xl',
        })
      }
    }
  }

  /**
   * Handle the deletion of the instance
   */
  const handleDelete = () => {
    if (nodeId) {
      const node = getNode(nodeId)

      if (node) {
        destroyInstance({ id: node.data.instanceId })
      }
    }
  }

  useEffect(() => {
    if (isDestroyInstanceError) {
      newToast({
        message: t('errorBoundary.generalError', { ns: 'common' }),
        status: 'error',
      })
    }
  }, [isDestroyInstanceError])

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
          {t('edit', { ns: 'common' })}
        </MenuItem>
        <MenuItem onClick={handleSeeUses} icon={<DuplicateIcon />}>
          {t('seeUses', { ns: 'common' })}
        </MenuItem>
        <MenuItem color='error' onClick={handleDelete} icon={<DeleteIcon />}>
          {t('remove', { ns: 'common' })}
        </MenuItem>
      </MenuList>
    </Menu>
  )
}

// TODO: Need attention, may cause problems with the memo
export default memo(NodeHeaderMenu)
