/**
 * The external imports
 */
import { HStack, Icon, Text } from '@chakra-ui/react'
import { CheckCircle2 } from 'lucide-react'

/**
 * The internal imports
 */
import { customFormatDuration } from '@/lib/utils/date'
import { PastMessageComponent } from '@/types'

const PastMessage: PastMessageComponent = ({ message }) => (
  <HStack justifyContent='space-between' w='full'>
    <HStack>
      <Icon as={CheckCircle2} color='success' />
      <Text fontSize='xs'>{message.message}</Text>
    </HStack>
    <Text fontSize='xs'>{customFormatDuration(message.elapsed_time)}</Text>
  </HStack>
)

export default PastMessage
