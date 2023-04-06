/**
 * The external imports
 */
import { getDescendants } from '@minoru/react-dnd-treeview'
import { Box, HStack, Icon, Text } from '@chakra-ui/react'
import { RxDragHandleDots2 } from 'react-icons/rx'
import type { MouseEvent } from 'react'

/**
 * The internal imports
 */
import { ShowMoreIcon } from '@/assets/icons'
import { TreeOrderingService } from '@/lib/services'
import type { TreeNodeComponent } from '@/types'

const TreeNode: TreeNodeComponent = ({
  node,
  depth,
  isOpen,
  hasChild,
  // TODO : DO WE NEED THIS ?
  // isDropTarget,
  onClick,
  treeData,
  getPipeHeight,
}) => {
  const handleToggle = (e: MouseEvent) => {
    e.stopPropagation()
    onClick(node.id)
  }

  const {
    TREE_X_OFFSET_PX,
    ROW_HEIGHT_PX,
    LIST_PADDING_PX,
    CIRCLE_WIDTH_PX,
    DOT_WIDTH_PX,
    PIPE_WIDTH_PX,
  } = TreeOrderingService

  return (
    <HStack
      ml={`${depth * TREE_X_OFFSET_PX}px`}
      onClick={hasChild ? handleToggle : undefined}
      mb={`${LIST_PADDING_PX}px`}
      alignItems='center'
      cursor='pointer'
      position='relative'
      w='60%'
      spacing={0}
    >
      {node.droppable ? (
        <Box>
          <HStack
            cursor='pointer'
            height={`${CIRCLE_WIDTH_PX}px`}
            width={`${CIRCLE_WIDTH_PX}px`}
            justifyContent='center'
            border='1px solid'
            borderColor='ordering'
            borderRadius='full'
            bg='white'
            transform={isOpen ? 'rotate(0deg)' : 'rotate(-90deg)'}
          >
            {hasChild && <ShowMoreIcon h={5} w={5} color='ordering' />}
          </HStack>
        </Box>
      ) : (
        <Box ml={`${(CIRCLE_WIDTH_PX - DOT_WIDTH_PX) / 2}px`}>
          <Box
            h={`${DOT_WIDTH_PX}px`}
            w={`${DOT_WIDTH_PX}px`}
            bg='ordering'
            borderRadius='full'
          />
        </Box>
      )}
      <Box>
        <Box
          h={`${PIPE_WIDTH_PX}px`}
          bg='pipe'
          zIndex={-1}
          width={`${TREE_X_OFFSET_PX - CIRCLE_WIDTH_PX}px`}
        />
      </Box>
      {getDescendants(treeData, node.parent)[0].id === node.id && (
        <Box>
          <Box
            position='absolute'
            zIndex={-1}
            left={`${(CIRCLE_WIDTH_PX - PIPE_WIDTH_PX) / 2}px`}
            top={depth === 0 ? `${ROW_HEIGHT_PX / 2}px` : 0}
            w={`${PIPE_WIDTH_PX}px`}
            bg='pipe'
            h={Math.max(0, getPipeHeight({ id: node.parent, treeData, depth }))}
          />
        </Box>
      )}
      <HStack
        boxShadow='md'
        spacing={4}
        h={`${ROW_HEIGHT_PX}px`}
        w='full'
        _hover={{
          bg: 'blackAlpha.50',
        }}
        alignItems='center'
      >
        <Box h='100%' w={`${CIRCLE_WIDTH_PX}px`} bg='primary'>
          {node.data?.isMoveable && (
            <Icon as={RxDragHandleDots2} color='white' h='full' w='full' />
          )}
        </Box>
        <Text fontWeight={node.parent === 0 ? 'bold' : 'normal'} noOfLines={1}>
          {node.text}
        </Text>
      </HStack>
    </HStack>
  )
}

export default TreeNode
