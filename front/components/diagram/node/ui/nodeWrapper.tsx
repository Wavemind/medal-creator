/**
 * The external imports
 */
import { memo, useMemo, useState } from 'react'
import ClickAwayListener from 'react-click-away-listener'
import { Box, useDisclosure } from '@chakra-ui/react'
import {
  Handle,
  Position,
  useReactFlow,
  getIncomers,
  useNodeId,
  useEdges,
} from 'reactflow'
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
  isNeonat?: boolean
  fromAvailableNode: boolean
}> = ({
  handleColor,
  mainColor,
  children,
  headerTitle,
  headerIcon,
  textColor,
  isNeonat = false,
  fromAvailableNode,
}) => {
  const { isOpen, onOpen, onClose } = useDisclosure()

  const [selected, setSelected] = useState(false)

  const { getNodes, getNode } = useReactFlow()
  const nodeId = useNodeId()
  const edges = useEdges()

  // Retrieves all incoming edges to the node
  const incomers = useMemo(() => {
    if (nodeId) {
      const node = getNode(nodeId)
      const nodes = getNodes()

      if (node) {
        return getIncomers(node, nodes, edges)
      }
    }

    return []
  }, [nodeId, edges])

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
        {!fromAvailableNode && (
          <Handle
            type='target'
            position={Position.Top}
            isConnectable={true}
            className='incoming_handle'
            style={{
              backgroundColor: handleColor,
              opacity: incomers.length > 0 ? 1 : 0.5,
            }}
          />
        )}

        <NodeHeader
          isNeonat={isNeonat}
          mainColor={mainColor}
          icon={headerIcon}
          category={headerTitle ?? ''}
          textColor={textColor}
          isOpen={isOpen}
          onOpen={onOpen}
          onClose={onClose}
          fromAvailableNode={fromAvailableNode}
        />
        {children}
      </Box>
    </ClickAwayListener>
  )
}

// TODO: Need attention, may cause problems with the memo
export default memo(NodeWrapper)
