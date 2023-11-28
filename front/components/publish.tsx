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
import { customFormatDuration } from '@/lib/utils/date'

const Publish = () => {
  const { t } = useTranslation('publication')

  const [selectedOption, setSelectedOption] =
    useState<SingleValue<Option>>(null)

  const {
    isReceiving,
    setIsReceiving,
    isError: isWebSocketError,
    messages,
    message,
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
          label: algorithm.node.id + " - " + algorithm.node.name,
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
        {!isReceiving && <Text fontSize='xs'>{t('instructions')}</Text>}
        <HStack spacing={5}></HStack>
        {selectedOption && (
          <VStack alignItems='flex-start' spacing={4} w='full'>
            <VStack alignItems='flex-start' w='full'>
              {messages &&
                messages.map(message => (
                  <HStack justifyContent='space-between' w='full'>
                    <HStack>
                      <Icon as={BsFillCheckCircleFill} color='success' />
                      <Text fontSize='xs'>{message.message}</Text>
                    </HStack>
                    <Text fontSize='xs'>
                      {customFormatDuration(message.elapsed_time)}
                    </Text>
                  </HStack>
                ))}
              {message && (
                <HStack justifyContent='space-between' w='full'>
                  <HStack>
                    <Spinner size='xs' />
                    <Text fontSize='xs'>{message}...</Text>
                  </HStack>
                </HStack>
              )}
              {(isWebSocketError || isError) && (
                <HStack justifyContent='space-between' w='full'>
                  <HStack>
                    <Icon as={BsFillXCircleFill} color='error' />
                    <Text fontSize='xs'>
                      {webSocketError || error?.message}
                    </Text>
                  </HStack>
                </HStack>
              )}
            </VStack>
          </VStack>
        )}
      </VStack>
    </Card>
  )
}

export default Publish
