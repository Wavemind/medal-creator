/**
 * The external imports
 */
import { useCallback, useEffect, useState } from 'react'
import {
  Text,
  Heading,
  Button,
  HStack,
  Tr,
  Td,
  Highlight,
  Accordion,
  AccordionItem,
  AccordionButton,
  AccordionPanel,
  AccordionIcon,
  Spinner,
  VStack,
  Icon,
} from '@chakra-ui/react'
import { serverSideTranslations } from 'next-i18next/serverSideTranslations'
import { skipToken } from '@reduxjs/toolkit/dist/query'
import { useTranslation } from 'next-i18next'
import { Link } from '@chakra-ui/next-js'
import type { GetServerSidePropsContext } from 'next'

/**
 * The internal imports
 */
import AlgorithmForm from '@/components/forms/algorithm'
import Page from '@/components/page'
import DataTable from '@/components/table/datatable'
import MenuCell from '@/components/table/menuCell'
import Card from '@/components/card'
import { wrapper } from '@/lib/store'
import {
  useLazyGetAlgorithmsQuery,
  useDestroyAlgorithmMutation,
  useDuplicateAlgorithmMutation,
  useGetAlgorithmQuery,
} from '@/lib/api/modules/enhanced/algorithm.enhanced'
import { getLanguages } from '@/lib/api/modules/enhanced/language.enhanced'
import { useAlertDialog } from '@/lib/hooks/useAlertDialog'
import { useAppRouter } from '@/lib/hooks/useAppRouter'
import { useModal } from '@/lib/hooks/useModal'
import { useToast } from '@/lib/hooks/useToast'
import { useProject } from '@/lib/hooks/useProject'
import { customFormatDuration, formatDate } from '@/lib/utils/date'
import WebSocketProvider from '@/lib/providers/webSocket'
import { useWebSocket } from '@/lib/hooks/useWebSocket'
import type { Algorithm, RenderItemFn, Scalars } from '@/types'
import { CheckCircle2, XCircle } from 'lucide-react'

const Duplicate = () => {
  const {
    isReceiving,
    setIsReceiving,
    isError: isWebSocketError,
    messages,
    message,
    elementId,
    error: webSocketError,
  } = useWebSocket()

  const [isDuplicating, setIsDuplicating] = useState(false)
  const [duplicatingId, setDuplicatingId] = useState<
    Scalars['ID'] | undefined | null
  >(null)

  const {
    data: algorithm,
    isSuccess: isAlgorithmSuccess,
    isError: isAlgorithmError,
  } = useGetAlgorithmQuery(duplicatingId ? { id: duplicatingId } : skipToken)

  return (
    <Card>
      <Accordion allowToggle>
        <AccordionItem border='none'>
          <AccordionButton p={4}>
            <HStack w='full' spacing={10}>
              {isDuplicating && <Spinner size='lg' thickness='3px' />}
              <Text>(Copy) {algorithm?.name}</Text>
            </HStack>
            <AccordionIcon />
          </AccordionButton>
          <AccordionPanel pb={4}>
            <VStack alignItems='flex-start' spacing={4} w='full'>
              <VStack alignItems='flex-start' w='full'>
                {messages &&
                  messages.map(message => (
                    <HStack justifyContent='space-between' w='full'>
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
                {isWebSocketError && (
                  <HStack w='full'>
                    <Icon as={XCircle} color='error' />
                    <Text fontSize='xs'>{webSocketError}</Text>
                  </HStack>
                )}
              </VStack>
            </VStack>
          </AccordionPanel>
        </AccordionItem>
      </Accordion>
    </Card>
  )
}

export default Duplicate
