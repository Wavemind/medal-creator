/**
 * The external imports
 */
import { getDescendants } from '@minoru/react-dnd-treeview'
import { Box, HStack } from '@chakra-ui/react'
import { motion } from 'framer-motion'
import type { MouseEvent } from 'react'

/**
 * The internal imports
 */
import ShowMoreIcon from '@/assets/icons/ShowMore'
import TreeOrderingService from '@/lib/services/treeOrdering.service'
import Dot from './dot'
import Pipe from './pipe'
import Item from './item'
import type { TreeNodeComponent } from '@/types'

const TreeNode: TreeNodeComponent = ({
  node,
  depth,
  isOpen,
  hasChild,
  onClick,
  treeData,
  usedVariables,
  getPipeHeight,
  enableDnd,
}) => {
  const { TREE_X_OFFSET_PX, LIST_PADDING_PX, CIRCLE_WIDTH_PX } =
    TreeOrderingService

  /**
   * Toggles the tree element open and close
   */
  function handleToggleOpen(e: MouseEvent): void {
    e.stopPropagation()
    onClick(node.id)
  }

  return (
    <HStack
      ml={`${depth * TREE_X_OFFSET_PX}px`}
      onClick={hasChild ? handleToggleOpen : undefined}
      mb={`${LIST_PADDING_PX}px`}
      position='relative'
      w='60%'
      spacing={0}
    >
      {node.droppable ? (
        <Box>
          <HStack
            as={motion.div}
            cursor='pointer'
            height={`${CIRCLE_WIDTH_PX}px`}
            width={`${CIRCLE_WIDTH_PX}px`}
            justifyContent='center'
            border='1px solid'
            borderColor='ordering'
            borderRadius='full'
            bg='white'
            initial={{
              transform: 'rotate(-90deg)',
            }}
            animate={{
              transform: isOpen ? 'rotate(0deg)' : 'rotate(-90deg)',
              transition: { duration: 0.2 },
            }}
          >
            {hasChild && <ShowMoreIcon h={5} w={5} color='ordering' />}
          </HStack>
        </Box>
      ) : (
        <Dot />
      )}
      <Pipe orientation='horizontal' />
      {getDescendants(treeData, node.parent)[0].id === node.id && (
        <Pipe
          orientation='vertical'
          h={Math.max(0, getPipeHeight({ id: node.parent, treeData, depth }))}
          depth={depth}
        />
      )}
      <Item enableDnd={enableDnd} node={node} usedVariables={usedVariables} />
    </HStack>
  )
}

export default TreeNode
