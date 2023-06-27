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
} from '@chakra-ui/react'
import type { FC, ReactElement } from 'react'

/**
 * The internal imports
 */
import { SettingsIcon } from '@/assets/icons'

const NodeHeader: FC<{
  mainColor: string
  icon: ReactElement | undefined
  category: string
  textColor: string
  isOpen: boolean
  onOpen: () => void
  onClose: () => void
}> = ({ mainColor, icon, category, textColor, isOpen, onOpen, onClose }) => {
  return (
    <HStack
      bg={mainColor}
      px={3}
      py={2}
      borderColor={mainColor}
      borderTopWidth={1}
      borderRightWidth={1}
      borderLeftWidth={1}
      justifyContent='space-between'
      borderTopLeftRadius={10}
      borderTopRightRadius={10}
    >
      <HStack>
        {icon}
        <Text color={textColor} fontSize='xs' fontWeight='bold'>
          {category}
        </Text>
      </HStack>
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
