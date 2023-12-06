/**
 * The external imports
 */
import { Box, HStack, Icon, Text } from '@chakra-ui/react'
import { GripVertical } from 'lucide-react'

/**
 * The internal imports
 */
import InformationIcon from '@/assets/icons/Information'
import TreeOrderingService from '@/lib/services/treeOrdering.service'
import type { PreviewComponent } from '@/types'

const Preview: PreviewComponent = ({ node }) => {
  const { ROW_HEIGHT_PX, CIRCLE_WIDTH_PX } = TreeOrderingService

  return (
    <Box w='42%' opacity={0.5}>
      <HStack
        spacing={4}
        h={`${ROW_HEIGHT_PX}px`}
        w='full'
        alignItems='center'
        justifyContent='space-between'
        pr={4}
        boxShadow='md'
        bg='white'
      >
        <Box
          h='100%'
          w={`${CIRCLE_WIDTH_PX}px`}
          minW={`${CIRCLE_WIDTH_PX}px`}
          bg='primary'
        >
          <Icon as={GripVertical} color='white' h='full' w='full' />
        </Box>
        <Text noOfLines={1} flex={1}>
          {node.text}
        </Text>
        <InformationIcon />
      </HStack>
    </Box>
  )
}

export default Preview
