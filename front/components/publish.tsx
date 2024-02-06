/**
 * The external imports
 */
import React, { useEffect, useMemo, useState } from 'react'
import {
  Text,
  HStack,
  VStack,
  Button,
  Spinner,
  Icon,
  Box,
} from '@chakra-ui/react'
import { useTranslation } from 'next-i18next'
import { CheckCircle2, XCircle } from 'lucide-react'
import { PropsValue, Select, SingleValue } from 'chakra-react-select'
import { isArray } from 'lodash'

/**
 * The internal imports
 */
import { useAppRouter } from '@/lib/hooks/useAppRouter'
import Card from '@/components/card'
import {
  useGetAlgorithmsQuery,
  usePublishAlgorithmMutation,
} from '@/lib/api/modules/enhanced/algorithm.enhanced'
import { useWebSocket } from '@/lib/hooks/useWebSocket'
import { customFormatDuration } from '@/lib/utils/date'
import { AlgorithmStatusEnum, type Option } from '@/types'
import { getKeys } from '@/lib/utils/convert'

const Publish = () => {
  const { t } = useTranslation('publication')

  const [selectedOption, setSelectedOption] = useState<PropsValue<Option>>(null)
  const [hasValidationErrors, setHasValidationErrors] = useState<boolean>(false)

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

  const [publishAlgorithm, { data: validationErrors, isError, error }] =
    usePublishAlgorithmMutation()

  /**
   * Filters algorithms to keep only the drafts for the select
   */
  const algorithmsForProduction = useMemo(() => {
    if (algorithms) {
      return algorithms.edges
        .filter(algorithm =>
          [AlgorithmStatusEnum.Draft, AlgorithmStatusEnum.Prod].includes(
            algorithm.node.status
          )
        )
        .map(algorithm => ({
          label: algorithm.node.name,
          value: algorithm.node.id,
        }))
    }

    return []
  }, [algorithms])

  useEffect(() => {
    if (validationErrors) {
      if (
        validationErrors.invalidDecisionTrees &&
        validationErrors.missingNodes
      ) {
        setHasValidationErrors(
          validationErrors.invalidDecisionTrees.length > 0 ||
            validationErrors.missingNodes.length > 0
        )
      }
    }
  }, [validationErrors])

  useEffect(() => {
    const currentOption = algorithmsForProduction.find(
      algorithm => algorithm.value === elementId
    )
    if (currentOption) {
      setSelectedOption(currentOption)
    }
  }, [elementId, algorithmsForProduction])

  useEffect(() => {
    if (isError) {
      setIsReceiving(false)
    }
  }, [isError])

  const isSingleValue = (value: unknown): value is SingleValue<Option> =>
    !isArray(value)

  const generate = () => {
    if (selectedOption && isSingleValue(selectedOption)) {
      setHasValidationErrors(false)
      publishAlgorithm({ id: selectedOption.value })
    }
  }

  useEffect(() => {
    if (validationErrors) {
      console.log(Object.entries(validationErrors))
    }
  }, [validationErrors])

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
            options={algorithmsForProduction}
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
        {messages.length === 0 && !hasValidationErrors && (
          <Text fontSize='xs'>{t('instructions')}</Text>
        )}
        {hasValidationErrors && (
          <Text fontSize='xs'>{t('correctValidationErrors')}</Text>
        )}
        <HStack spacing={5} />
        <VStack alignItems='flex-start' w='full'>
          {hasValidationErrors && validationErrors && (
            <VStack alignItems='flex-start' spacing={8}>
              {getKeys(validationErrors).map(category => {
                return (
                  <VStack alignItems='flex-start'>
                    <Text fontSize='sm'>
                      {t(`errorCategories.${category}`)} :
                    </Text>
                    {validationErrors[category]?.map(error => (
                      <HStack w='full'>
                        <Icon as={XCircle} color='error' />
                        <Text fontSize='xs'>{error.labelTranslations.en}</Text>
                      </HStack>
                    ))}
                  </VStack>
                )
              })}
            </VStack>
          )}
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
          {(isWebSocketError || isError) && (
            <HStack w='full'>
              <Icon as={XCircle} color='error' />
              <Text fontSize='xs'>{webSocketError || error?.message}</Text>
            </HStack>
          )}
        </VStack>
      </VStack>
    </Card>
  )
}

export default Publish
