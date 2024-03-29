/**
 * The external imports
 */
import { useEffect } from 'react'
import {
  Text,
  HStack,
  Accordion,
  AccordionItem,
  AccordionButton,
  AccordionPanel,
  AccordionIcon,
  Spinner,
  VStack,
  Icon,
} from '@chakra-ui/react'
import { useTranslation } from 'next-i18next'
import { CheckCircle2, XCircle } from 'lucide-react'
import { skipToken } from '@reduxjs/toolkit/dist/query'

/**
 * The internal imports
 */
import Card from '@/components/card'
import { useGetAlgorithmQuery } from '@/lib/api/modules/enhanced/algorithm.enhanced'
import { customFormatDuration } from '@/lib/utils/date'
import { useWebSocket } from '@/lib/hooks/useWebSocket'
import type { DuplicateComponent } from '@/types'

const Duplicate: DuplicateComponent = ({ error, setIsDuplicating }) => {
  const { t } = useTranslation('algorithms')
  const {
    isReceiving,
    setIsReceiving,
    isSuccess,
    isError: isWebSocketError,
    messages,
    message,
    elementId,
    error: webSocketError,
  } = useWebSocket()

  const { data: algorithm, isError: isAlgorithmError } = useGetAlgorithmQuery(
    elementId ? { id: elementId } : skipToken
  )

  useEffect(() => {
    if (error) {
      setIsReceiving(false)
    }
  }, [error])

  useEffect(() => {
    setIsDuplicating(isReceiving)
  }, [isReceiving])

  return (
    <Card>
      <Accordion allowToggle>
        <AccordionItem border='none'>
          <AccordionButton p={4}>
            <HStack w='full' spacing={8}>
              {isReceiving && <Spinner size='md' thickness='3px' />}
              {(isWebSocketError || isAlgorithmError) && (
                <Icon as={XCircle} color='error' />
              )}
              {isSuccess && <Icon as={CheckCircle2} color='success' />}
              <Text>
                {algorithm
                  ? t('duplicating', { name: algorithm.name })
                  : t('noDuplication')}
              </Text>
            </HStack>
            <AccordionIcon />
          </AccordionButton>
          <AccordionPanel p={algorithm ? 4 : 0}>
            <VStack alignItems='flex-start' w='full'>
              {messages &&
                messages.map(message => (
                  <HStack
                    key={`message_${message.message}`}
                    justifyContent='space-between'
                    w='full'
                  >
                    <HStack>
                      <Icon as={CheckCircle2} color='success' />
                      <Text fontSize='xs'>{message.message}</Text>
                    </HStack>
                    <Text fontSize='xs'>
                      {customFormatDuration(message.elapsed_time)}
                    </Text>
                  </HStack>
                ))}
              {message && (
                <HStack w='full'>
                  <Spinner size='xs' />
                  <Text fontSize='xs'>{message}...</Text>
                </HStack>
              )}
              {(isWebSocketError || error) && (
                <HStack w='full'>
                  <Icon as={XCircle} color='error' />
                  <Text fontSize='xs'>{webSocketError || error?.message}</Text>
                </HStack>
              )}
            </VStack>
          </AccordionPanel>
        </AccordionItem>
      </Accordion>
    </Card>
  )
}

export default Duplicate
