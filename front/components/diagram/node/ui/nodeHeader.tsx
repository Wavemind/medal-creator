/**
 * The external imports
 */
import { memo } from 'react'
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

/**
 * The internal imports
 */
import { SettingsIcon } from '@/assets/icons'
import type { NodeHeaderComponent } from '@/types'

const NodeHeader: NodeHeaderComponent = ({
  mainColor,
  icon,
  category,
  textColor,
  isOpen,
  onOpen,
  onClose,
  isNeonat,
}) => {
  const { t } = useTranslation('variables')

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
          <HStack
            bg='diagram.neonat'
            borderTopLeftRadius={10}
            borderTopRightRadius={10}
            borderBottomRightRadius={10}
            px={3}
            py={2}
          >
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
          <MenuItem>New Tab</MenuItem>
          <MenuItem>New Window</MenuItem>
          <MenuItem>Open Closed Tab</MenuItem>
          <MenuItem>Open File...</MenuItem>
        </MenuList>
      </Menu>
    </HStack>
  )
}

// TODO: Need attention, may cause problems with the memo
export default memo(NodeHeader)
