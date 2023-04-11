/**
 * The external imports
 */
import { Box } from '@chakra-ui/react'

/**
 * The internal imports
 */
import { TreeOrderingService } from '@/lib/services'
import type { PipeProps } from '@/types'

const Pipe: PipeProps = ({ orientation, depth, ...props }) => {
  const {
    TREE_X_OFFSET_PX,
    CIRCLE_WIDTH_PX,
    PIPE_WIDTH_PX,
    ROW_HEIGHT_PX,
    LIST_PADDING_PX,
  } = TreeOrderingService

  return (
    <Box>
      <Box
        bg='pipe'
        zIndex={-1}
        h={orientation === 'horizontal' ? `${PIPE_WIDTH_PX}px` : props.h}
        w={
          orientation === 'horizontal'
            ? `${TREE_X_OFFSET_PX - CIRCLE_WIDTH_PX}px`
            : `${PIPE_WIDTH_PX}px`
        }
        position={orientation === 'horizontal' ? 'relative' : 'absolute'}
        left={
          orientation === 'horizontal'
            ? 0
            : `${(CIRCLE_WIDTH_PX - PIPE_WIDTH_PX) / 2}px`
        }
        top={
          orientation === 'horizontal'
            ? 0
            : `${depth === 0 ? ROW_HEIGHT_PX / 2 : -LIST_PADDING_PX}px`
        }
        {...props}
      />
    </Box>
  )
}

export default Pipe
