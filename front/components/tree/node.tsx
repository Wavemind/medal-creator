import React from 'react'
import { getDescendants } from '@minoru/react-dnd-treeview'
import { Box, Text } from '@chakra-ui/react'
import styles from '@/styles/consultationOrder.module.scss'
import { ShowMoreIcon } from '@/assets/icons'
import { TreeNodeModel } from '@/types'

const TREE_X_OFFSET = 22

const Node: React.FC<{
  node: TreeNodeModel
  depth: number
  isOpen: boolean
  language: string
  isDropTarget: boolean
  treeData: TreeNodeModel[]
  onClick: (id: TreeNodeModel['id']) => void
  getPipeHeight: (id: string | number, treeData: TreeNodeModel[]) => number
}> = ({
  node,
  depth,
  isOpen,
  isDropTarget,
  onClick,
  language,
  treeData,
  getPipeHeight,
}) => {
  const indent = depth * TREE_X_OFFSET

  const handleToggle = (e: React.MouseEvent) => {
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
        style={{ width: depth > 0 ? TREE_X_OFFSET - 9 : 0 }}
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
        {node.data?.labelTranslations[language]}
      </Text>

      <Box
        className={`${styles.expandIconWrapper} ${isOpen ? styles.isOpen : ''}`}
      >
        {node.droppable && <ShowMoreIcon />}
      </Box>
    </Box>
  )
}

export default Node
