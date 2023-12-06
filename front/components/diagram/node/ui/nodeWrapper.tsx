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
  type Edge,
} from 'reactflow'

/**
 * The internal imports
 */
import NodeHeader from '@/components/diagram/node/ui/nodeHeader'
import type { InstantiatedNode, NodeWrapperComponent } from '@/types'

const NodeWrapper: NodeWrapperComponent = ({
  backgroundColor,
  children,
  headerTitle,
  headerIcon,
  color,
  isNeonat = false,
  fromAvailableNode,
  minScore = null,
}) => {
  const { isOpen, onOpen, onClose } = useDisclosure()

  const [selected, setSelected] = useState(false)

  const { getNodes, getNode } = useReactFlow<InstantiatedNode, Edge>()
  const nodeId = useNodeId()
  const edges = useEdges()

  /**
   * Retrieves all incoming edges to the node
   */
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

  /**
   * Close the menu and unselect the element
   */
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
      <Box borderRadius={10} minW={250}>
        {!fromAvailableNode && (
          <Handle
            type='target'
            position={Position.Top}
            isConnectable={true}
            className='incoming_handle'
            style={{
              backgroundColor,
              opacity: incomers.length > 0 ? 1 : 0.5,
            }}
          />
        )}

        <NodeHeader
          isNeonat={isNeonat}
          backgroundColor={backgroundColor}
          icon={headerIcon}
          category={headerTitle ?? ''}
          color={color}
          isOpen={isOpen}
          onOpen={onOpen}
          onClose={onClose}
          fromAvailableNode={fromAvailableNode}
          minScore={minScore}
        />
        {children}
      </Box>
    </ClickAwayListener>
  )
}

export default memo(NodeWrapper)
