/**
 * The external imports
 */
import { Box, HStack, Icon, Tooltip, Text } from '@chakra-ui/react'
import { RxDragHandleDots2 } from 'react-icons/rx'

/**
 * The internal imports
 */
import { InformationIcon } from '@/assets/icons'
import { TreeOrderingService } from '@/lib/services'
import type { ItemComponent } from '@/types'

const Item: ItemComponent = ({ enableDnd, node, hasChild }) => {
  const { ROW_HEIGHT_PX, CIRCLE_WIDTH_PX } = TreeOrderingService

  // TODO : Open the modal and display info
  const openInfo = () => {
    console.log('open the info modal')
  }

  return (
    <HStack
      cursor={enableDnd ? 'pointer' : 'default'}
      boxShadow='md'
      spacing={4}
      h={`${ROW_HEIGHT_PX}px`}
      w='full'
      _hover={{
        bg: enableDnd ? 'blackAlpha.50' : 'white',
      }}
      alignItems='center'
      justifyContent='space-between'
      pr={4}
    >
      <Box
        h='100%'
        w={`${CIRCLE_WIDTH_PX}px`}
        minW={`${CIRCLE_WIDTH_PX}px`}
        bg='primary'
      >
        {node.data?.isMoveable && (
          <Icon as={RxDragHandleDots2} color='white' h='full' w='full' />
        )}
      </Box>
      <Tooltip hasArrow label={node.text} aria-label={node.text}>
        <Text
          fontWeight={node.parent === 0 ? 'bold' : 'normal'}
          noOfLines={1}
          flex={1}
        >
          {node.text}
        </Text>
      </Tooltip>
      {!hasChild && <InformationIcon onClick={openInfo} cursor='pointer' />}
    </HStack>
  )
}

export default Item
