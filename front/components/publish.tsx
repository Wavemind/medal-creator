/**
 * The external imports
 */
import React, { useEffect, useMemo, useState } from 'react'
import { Text, HStack, VStack, Button, Spinner, Icon } from '@chakra-ui/react'
import { useTranslation } from 'next-i18next'
import { BsFillCheckCircleFill, BsFillXCircleFill } from 'react-icons/bs'
import { Select, SingleValue } from 'chakra-react-select'

/**
 * The internal imports
 */
import { useAppRouter } from '@/lib/hooks'
import Card from '@/components/card'
import {
  useGetAlgorithmsQuery,
  usePublishAlgorithmMutation,
} from '@/lib/api/modules/enhanced/algorithm.enhanced'
import { useWebSocket } from '@/lib/hooks/useWebSocket'
import { AlgorithmStatusEnum, Option } from '@/types'

// TODO : When algorithm has been generated properly, refetch getAlgorithms
// to update the cache and reflect the new changes
const Publish = () => {
  const { t } = useTranslation('publication')

  const [selectedOption, setSelectedOption] =
    useState<SingleValue<Option>>(null)

  const {
    isReceiving,
    setIsReceiving,
    isSuccess: isWebSocketSuccess,
    isError: isWebSocketError,
    messages,
    elementId,
    error: webSocketError,
  } = useWebSocket()

  const {
    query: { projectId },
  } = useAppRouter()

  const { data: algorithms } = useGetAlgorithmsQuery({
    projectId,
    filters: {
      statuses: [AlgorithmStatusEnum.Draft, AlgorithmStatusEnum.Prod],
    },
  })

  const [publishAlgorithm, { isError, error }] = usePublishAlgorithmMutation()

  /**
   * Filters algorithms to keep only the drafts for the select
   */
  const drafts = useMemo(() => {
    if (algorithms) {
      return algorithms.edges
        .filter(
          algorithm => algorithm.node.status === AlgorithmStatusEnum.Draft
        )
        .map(algorithm => ({
          label: algorithm.node.name,
          value: algorithm.node.id,
        }))
    }

    return []
  }, [algorithms])

  useEffect(() => {
    const currentOption = drafts.find(draft => draft.value === elementId)
    if (currentOption) {
      setSelectedOption(currentOption)
    }
  }, [elementId, drafts])

  useEffect(() => {
    if (isError) {
      setIsReceiving(false)
    }
  }, [isError])

  const generate = () => {
    if (selectedOption) {
      publishAlgorithm({ id: selectedOption.value })
    }
  }

  return (
    <Card px={4} pt={3} pb={8}>
      <VStack w='full' alignItems='flex-start' spacing={4}>
        <HStack w='full' spacing={7}>
          <Select
            isMulti={false}
            value={selectedOption}
            placeholder={t('placeholder')}
            onChange={setSelectedOption}
            isSearchable={false}
            isClearable={true}
            options={drafts}
            isDisabled={isReceiving}
            chakraStyles={{
              container: provided => ({
                ...provided,
                width: '100%',
              }),
            }}
          />
          <Button
            onClick={generate}
            isDisabled={!selectedOption || isReceiving}
          >
            {t('generate')}
          </Button>
        </HStack>
        <Text fontSize='xs'>{t('instructions')}</Text>
        {selectedOption && (
          <VStack alignItems='flex-start' spacing={4} w='full'>
            <VStack alignItems='flex-start' w='full'>
              {messages &&
                messages.map(message => (
                  <HStack justifyContent='space-between' w='full'>
                    <Text fontSize='xs'>{message.message}...</Text>
                    <Text fontSize='xs'>
                      {message.elapsed_time.toFixed(2)}s
                    </Text>
                  </HStack>
                ))}
            </VStack>
            <HStack spacing={5}>
              {isReceiving && <Spinner />}
              {isWebSocketSuccess && (
                <Icon as={BsFillCheckCircleFill} color='success' h={6} w={6} />
              )}
              {(isWebSocketError || isError) && (
                <Icon as={BsFillXCircleFill} color='error' h={6} w={6} />
              )}
              <Text>{selectedOption.label}</Text>
            </HStack>
            {(isWebSocketError || isError) && (
              <Text color='error' fontSize='xs'>
                {webSocketError || error?.message}
              </Text>
            )}
          </VStack>
        )}
      </VStack>
    </Card>
  )
}

export default Publish
