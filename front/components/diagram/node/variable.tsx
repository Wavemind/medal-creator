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
import { SettingsIcon } from '@/assets/icons'
import ClickAwayListener from 'react-click-away-listener'

const VariableNode: FC = ({ data, isConnectable }) => {
  const { colors } = useTheme()
  const { isOpen, onOpen, onClose } = useDisclosure()

  return (
    <ClickAwayListener onClickAway={onClose}>
      <Box
        borderRadius={10}
        bg='transparent'
        borderWidth={1}
        borderColor={colors.ordering}
      >
        <Handle
          type='target'
          position={Position.Top}
          isConnectable={isConnectable}
          style={{
            height: '20px',
            width: '20px',
            zIndex: '-1',
            top: '-10px',
            borderRadius: '50%',
            backgroundColor: colors.ordering,
          }}
        />
        <HStack
          bg={colors.sidebar}
          px={3}
          py={2}
          justifyContent='space-between'
          borderTopLeftRadius={10}
          borderTopRightRadius={10}
        >
          <Text color='primary' fontSize='xs' fontWeight='bold'>
            {data.type}
          </Text>

          <Menu isLazy isOpen={isOpen} onOpen={onOpen} onClose={onClose}>
            <MenuButton
              as={IconButton}
              isRound
              aria-label='Options'
              icon={<SettingsIcon />}
              variant={'ghost'}
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
        <Flex px={12} py={4} justifyContent='center' bg='white'>
          <Text>{data.label}</Text>
        </Flex>
        <HStack spacing={0} justifyContent='space-evenly'>
          {data.answers.map((answer, index) => (
            <Handle
              type='source'
              position={Position.Bottom}
              id={answer.id}
              isConnectable={isConnectable}
              style={{
                padding: '10px',
                flexGrow: 1,
                backgroundColor: colors.primary,
                borderBottomLeftRadius: index === 0 ? '10px' : '0px',
                borderBottomRightRadius:
                  index === data.answers.length - 1 ? '10px' : '0px',
                display: 'flex',
                justifyContent: 'center',
              }}
            >
              <Text color='white' fontSize='xs' pointerEvents='none'>
                {answer.label}
              </Text>
              <Circle
                position='absolute'
                bg={colors.ordering}
                size={5}
                top={30}
                zIndex='-1'
                pointerEvents='none'
              />
            </Handle>
            // <Handle
            //   type='source'
            //   position={Position.Bottom}
            //   id={answer.id}
            //   isConnectable={isConnectable}
            //   style={{
            //     backgroundColor: 'transparent',
            //     width: '100%',
            //   }}
            // >
            //   <VStack spacing={0} pointerEvents='none' flexGrow={2}>
            //     <Flex
            //       pointerEvents='none'
            //       bg={colors.primary}
            //       p={3}
            //       borderBottomLeftRadius={index === 0 ? '10px' : '0px'}
            //       borderBottomRightRadius={
            //         index === data.answers.length - 1 ? '10px' : '0px'
            //       }
            //     >
            //       <Text
            //         color='white'
            //         align='center'
            //         fontSize='xs'
            //         pointerEvents='none'
            //       >
            //         {answer.label}
            //       </Text>
            //     </Flex>
            //     <Circle size={5} bg={colors.ordering} mt='-10px' zIndex='-1' />
            //   </VStack>
            // </Handle>
          ))}
        </HStack>
      </Box>
    </ClickAwayListener>
  )
}

// TODO: Need attention, may cause problems with the memo
export default memo(VariableNode)
