/**
 * The external imports
 */
import React, { useEffect, useMemo, useState } from 'react'
import { Text, HStack, VStack, Button } from '@chakra-ui/react'
import { useTranslation } from 'next-i18next'
import { PropsValue, Select, SingleValue } from 'chakra-react-select'
import { isArray } from 'lodash'

/**
 * The internal imports
 */
import { useAppRouter } from '@/lib/hooks/useAppRouter'
import Card from '@/components/card'
import CurrentMessage from '@/components/publish/currentMessage'
import PastMessage from '@/components/publish/pastMessage'
import ValidationErrors from '@/components/publish/validationErrors'
import ErrorMessage from '@/components/publish/errorMessage'
import {
  useGetAlgorithmsQuery,
  usePublishAlgorithmMutation,
} from '@/lib/api/modules/enhanced/algorithm.enhanced'
import { useWebSocket } from '@/lib/hooks/useWebSocket'
import { AlgorithmStatusEnum, type Scalars, type Option } from '@/types'

const Publish = () => {
  const { t } = useTranslation('publication')

  const [selectedOption, setSelectedOption] = useState<PropsValue<Option>>(null)
  const [selectedAlgorithmId, setSelectedAlgorithmId] = useState<
    Scalars['ID'] | null
  >(null)
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
    if (selectedAlgorithmId) {
      setHasValidationErrors(false)
      publishAlgorithm({ id: selectedAlgorithmId })
    }
  }

  useEffect(() => {
    if (selectedOption && isSingleValue(selectedOption)) {
      setSelectedAlgorithmId(selectedOption.value)
    } else {
      setSelectedAlgorithmId(null)
      setHasValidationErrors(false)
    }
  }, [selectedOption])

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
            <ValidationErrors
              errors={validationErrors}
              selectedAlgorithmId={selectedAlgorithmId}
            />
          )}
          {messages &&
            messages.map(message => <PastMessage message={message} />)}
          {message && <CurrentMessage message={message} />}
          {(isWebSocketError || isError) && (
            <ErrorMessage message={webSocketError || error?.message} />
          )}
        </VStack>
      </VStack>
    </Card>
  )
}

export default Publish
