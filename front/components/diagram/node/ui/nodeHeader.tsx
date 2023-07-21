/**
 * The external imports
 */
import { memo, useContext, useEffect } from 'react'
import {
  Text,
  HStack,
  Menu,
  MenuButton,
  IconButton,
  MenuList,
  MenuItem,
  Icon,
  Tooltip,
} from '@chakra-ui/react'
import { useTranslation } from 'next-i18next'
import { PiBabyBold } from 'react-icons/pi'
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
import { DiagnosisForm, VariableStepper } from '@/components'
import { useAppRouter, useToast } from '@/lib/hooks'
import { ModalContext } from '@/lib/contexts'
import { useDestroyInstanceMutation } from '@/lib/api/modules'
import type { InstantiatedNode, NodeHeaderComponent } from '@/types'

const NodeHeader: NodeHeaderComponent = ({
  mainColor,
  icon,
  category,
  textColor,
  isOpen,
  onOpen,
  onClose,
  isNeonat,
  fromAvailableNode,
}) => {
  const { t } = useTranslation('variables')

  const {
    query: { projectId },
  } = useAppRouter()

  const { open: openModal } = useContext(ModalContext)
  const { newToast } = useToast()

  const [destroyInstance, { isError: isDestroyInstanceError }] =
    useDestroyInstanceMutation()

  const { getNode } = useReactFlow<InstantiatedNode, Edge>()
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
                />
              ),
              size: '5xl',
            })
        }
      }
    }
  }

  /**
   * Handle opening of the modal to see the uses of the node
   */
  const handleSeeUses = () => {
    console.log('open the modal to see the uses of the node')
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
    <HStack
      bg={mainColor}
      borderColor={mainColor}
      borderTopWidth={1}
      borderRightWidth={1}
      borderLeftWidth={1}
      justifyContent='space-between'
      borderTopRightRadius={10}
      borderTopLeftRadius={10}
    >
      {isNeonat ? (
        <Tooltip label={t('isNeonat')} placement='top' hasArrow>
          <HStack bg='diagram.neonat' borderTopLeftRadius={10} px={3} py={2}>
            <Icon as={PiBabyBold} color='white' />
            <Text fontSize='xs' fontWeight='bold' color='white'>
              {category}
            </Text>
          </HStack>
        </Tooltip>
      ) : (
        <HStack px={3} py={2}>
          {icon}
          <Text color={textColor} fontSize='xs' fontWeight='bold'>
            {category}
          </Text>
        </HStack>
      )}

      {/* TODO: Waiting action */}
      {!fromAvailableNode && (
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
            <MenuItem
              color='error'
              onClick={handleDelete}
              icon={<DeleteIcon />}
            >
              {t('remove', { ns: 'common' })}
            </MenuItem>
          </MenuList>
        </Menu>
      )}
    </HStack>
  )
}

// TODO: Need attention, may cause problems with the memo
export default memo(NodeHeader)
