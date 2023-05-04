/**
 * The external imports
 */
import { Box } from '@chakra-ui/react'
import type { FC } from 'react'

/**
 * The internal imports
 */
import { TreeOrderingService } from '@/lib/services'

const Dot: FC = () => {
  const { CIRCLE_WIDTH_PX, DOT_WIDTH_PX } = TreeOrderingService

  return (
    <Box ml={`${(CIRCLE_WIDTH_PX - DOT_WIDTH_PX) / 2}px`}>
      <Box
        h={`${DOT_WIDTH_PX}px`}
        w={`${DOT_WIDTH_PX}px`}
        bg='ordering'
        borderRadius='full'
      />
    </Box>
  )
}

export default Dot
