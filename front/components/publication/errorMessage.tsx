/**
 * The external imports
 */
import { HStack, Icon, Text } from '@chakra-ui/react'
import { XCircle } from 'lucide-react'

/**
 * The internal imports
 */
import type { PublishErrorMessageComponent } from '@/types'

const ErrorMessage: PublishErrorMessageComponent = ({ message }) => (
  <HStack w='full'>
    <Icon as={XCircle} color='error' />
    <Text fontSize='xs'>{message}</Text>
  </HStack>
)

export default ErrorMessage
