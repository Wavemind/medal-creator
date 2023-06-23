/**
 * The external imports
 */
import { memo } from 'react'
import {
  Box,
  Text,
  HStack,
  Flex,
  useTheme,
  Menu,
  MenuButton,
  IconButton,
  MenuList,
  MenuItem,
  useDisclosure,
  Circle,
} from '@chakra-ui/react'
import { Handle, Position } from 'reactflow'
import type { FC } from 'react'

/**
 * The internal imports
 */
import { SettingsIcon, AlgorithmsIcon } from '@/assets/icons'
import ClickAwayListener from 'react-click-away-listener'

const DiagnosisNode: FC = ({ data, isConnectable }) => {
  const { colors } = useTheme()
  const { isOpen, onOpen, onClose } = useDisclosure()

  return (
    <ClickAwayListener onClickAway={onClose}>
      <Box>
        <Handle
          id={`${data.id}-top`}
          type='target'
          position={Position.Top}
          isConnectable={isConnectable}
          style={{
            height: '20px',
            width: '20px',
            zIndex: '-1',
            top: '-10px',
            borderRadius: '50%',
            backgroundColor: colors.diagnosisHandle,
          }}
        />
        <HStack
          bg={colors.secondary}
          px={3}
          py={2}
          borderColor={colors.secondary}
          borderTopWidth={1}
          borderRightWidth={1}
          borderLeftWidth={1}
          justifyContent='space-between'
          borderTopLeftRadius={10}
          borderTopRightRadius={10}
        >
          <HStack>
            <AlgorithmsIcon color='white' />
            <Text color='white' fontSize='xs' fontWeight='bold'>
              {data.type}
            </Text>
            <Handle
              id={`${data.id}-left`}
              type='source'
              position={Position.Left}
              isConnectable={isConnectable}
              style={{
                height: '20px',
                width: '20px',
                zIndex: '-1',
                borderRadius: '50%',
                left: '-10px',
                backgroundColor: colors.secondary,
              }}
            />
            <Handle
              id={`${data.id}-right`}
              type='target'
              position={Position.Right}
              isConnectable={isConnectable}
              style={{
                height: '20px',
                width: '20px',
                zIndex: '-1',
                borderRadius: '50%',
                right: '-10px',
                backgroundColor: colors.secondary,
              }}
            />
          </HStack>
          <Menu isLazy isOpen={isOpen} onOpen={onOpen} onClose={onClose}>
            <MenuButton
              as={IconButton}
              isRound
              aria-label='Options'
              icon={<SettingsIcon color='white' />}
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
        <Flex
          px={12}
          py={4}
          justifyContent='center'
          bg='white'
          borderColor={colors.secondary}
          borderBottomWidth={1}
          borderRightWidth={1}
          borderLeftWidth={1}
          borderBottomLeftRadius={10}
          borderBottomRightRadius={10}
        >
          <Text fontSize='lg'>{data.label}</Text>
        </Flex>
      </Box>
    </ClickAwayListener>
  )
}

// TODO: Need attention, may cause problems with the memo
export default memo(DiagnosisNode)
