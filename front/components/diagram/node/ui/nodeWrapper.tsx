/**
 * The external imports
 */
import { memo, useState } from 'react'
import ClickAwayListener from 'react-click-away-listener'
import { Box, useDisclosure } from '@chakra-ui/react'
import { Handle, Position } from 'reactflow'
import type { FC, ReactElement } from 'react'

/**
 * The internal imports
 */
import NodeHeader from './nodeHeader'

const NodeWrapper: FC<{
  handleColor: string
  mainColor: string
  headerTitle: string | undefined
  headerIcon?: ReactElement
  children: ReactElement
  textColor: string
}> = ({
  handleColor,
  mainColor,
  children,
  headerTitle,
  headerIcon,
  textColor,
}) => {
  const { isOpen, onOpen, onClose } = useDisclosure()

  const [selected, setSelected] = useState(false)

  // Close the menu and unselect the element
  const handleClickAway = () => {
    if (isOpen) {
      onClose()
    }

    if (selected) {
      setSelected(false)
    }
  }

  return (
    <ClickAwayListener onClickAway={handleClickAway}>
      <Box borderRadius={10}>
        <Handle
          type='target'
          position={Position.Top}
          isConnectable={true}
          style={{
            height: '20px',
            width: '20px',
            zIndex: '-1',
            top: '-10px',
            borderRadius: '50%',
            backgroundColor: handleColor,
          }}
        />
        <NodeHeader
          mainColor={mainColor}
          icon={headerIcon}
          title={headerTitle ?? ''}
          textColor={textColor}
          isOpen={isOpen}
          onOpen={onOpen}
          onClose={onClose}
        />
        {children}
      </Box>
    </ClickAwayListener>
  )
}

// TODO: Need attention, may cause problems with the memo
export default memo(NodeWrapper)
