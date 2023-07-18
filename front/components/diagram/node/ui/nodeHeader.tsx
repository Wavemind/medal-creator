/**
 * The external imports
 */
import { memo, useContext } from 'react'
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
import { SettingsIcon } from '@/assets/icons'
import { DiagnosisForm, VariableStepper } from '@/components'
import { useAppRouter } from '@/lib/hooks'
import { ModalContext } from '@/lib/contexts'
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

  const { getNode } = useReactFlow<InstantiatedNode, Edge>()
  const nodeId = useNodeId()

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
          case 'medicalCase':
            console.log('open medical case')
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
            <MenuItem onClick={handleEdit}>
              {t('edit', { ns: 'common' })}
            </MenuItem>
          </MenuList>
        </Menu>
      )}
    </HStack>
  )
}

// TODO: Need attention, may cause problems with the memo
export default memo(NodeHeader)
