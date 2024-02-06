/**
 * The external imports
 */
import { HStack, Spinner, Text } from '@chakra-ui/react'

/**
 * The internal imports
 */
import type { CurrentMessageComponent } from '@/types'

const CurrentMessage: CurrentMessageComponent = ({ message }) => (
  <HStack w='full'>
    <Spinner size='xs' />
    <Text fontSize='xs'>{message}...</Text>
  </HStack>
)

export default CurrentMessage
