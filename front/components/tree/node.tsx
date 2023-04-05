/**
 * The external imports
 */
import { getDescendants } from '@minoru/react-dnd-treeview'
import { Box, Text } from '@chakra-ui/react'
import type { MouseEvent } from 'react'

/**
 * The internal imports
 */
import { ShowMoreIcon } from '@/assets/icons'
import { TreeOrderingService } from '@/lib/services'
import type { TreeNodeComponent } from '@/types'

import styles from '@/styles/consultationOrder.module.scss'

const TreeNode: TreeNodeComponent = ({
  node,
  depth,
  isOpen,
  hasChild,
  isDropTarget,
  onClick,
  treeData,
  getPipeHeight,
}) => {
  const indent = depth * TreeOrderingService.TREE_X_OFFSET

  const handleToggle = (e: MouseEvent) => {
    e.stopPropagation()
    onClick(node.id)
  }

  return (
    <Box
      className={`${styles.nodeWrapper} tree ${
        node.droppable && isDropTarget ? styles.dropTarget : ''
      }`}
      style={{ marginInlineStart: indent }}
      onClick={handleToggle}
    >
      <Box
        className={styles.pipeX}
        style={{ width: depth > 0 ? TreeOrderingService.TREE_X_OFFSET - 9 : 0 }}
      />
      {getDescendants(treeData, node.parent)[0].id === node.id && (
        <Box
          className={styles.pipeY}
          style={{
            height: Math.max(0, getPipeHeight(node.parent, treeData) - 8),
          }}
        />
      )}
      <Text fontWeight={node.parent === 0 ? 'bold' : 'normal'}>
        {node.text}
      </Text>

      {node.droppable && (
        <Box
          className={`${styles.expandIconWrapper} ${
            isOpen ? styles.isOpen : ''
          }`}
        >
          {hasChild && <ShowMoreIcon />}
        </Box>
      )}
    </Box>
  )
}

export default TreeNode
