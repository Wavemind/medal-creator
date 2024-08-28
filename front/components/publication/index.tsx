/**
 * The external imports
 */
import React, {useEffect, useMemo, useState} from 'react'
import {Button, HStack, Text, VStack} from '@chakra-ui/react'
import {useTranslation} from 'next-i18next'
import {PropsValue, Select, SingleValue} from 'chakra-react-select'
import {isArray} from 'lodash'

/**
 * The internal imports
 */
import {useAppRouter} from '@/lib/hooks/useAppRouter'
import Card from '@/components/card'
import CurrentMessage from '@/components/publication/currentMessage'
import PastMessage from '@/components/publication/pastMessage'
import ValidationErrors from '@/components/publication/validationErrors'
import ErrorMessage from '@/components/publication/errorMessage'
import {useGetAlgorithmsQuery, usePublishAlgorithmMutation,} from '@/lib/api/modules/enhanced/algorithm.enhanced'
import {useWebSocket} from '@/lib/hooks/useWebSocket'
import {AlgorithmStatusEnum, type Option, PublicationStatusEnum, type Scalars,} from '@/types'

const Publish = () => {
  const { t } = useTranslation('publication')

  const [selectedOption, setSelectedOption] = useState<PropsValue<Option>>(null)
  const [selectedStatusOption, setSelectedStatusOption] =
    useState<PropsValue<Option>>(null)
  const [selectedAlgorithmId, setSelectedAlgorithmId] = useState<
    Scalars['ID'] | null
  >(null)
  const [selectedStatus, setSelectedStatus] =
    useState<PublicationStatusEnum | null>(null)
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
      statuses: [AlgorithmStatusEnum.Draft, AlgorithmStatusEnum.Prod, AlgorithmStatusEnum.Test],
    },
  })

  const [
    publishAlgorithm,
    { data: validationErrors, isLoading, isError, error },
  ] = usePublishAlgorithmMutation()

  /**
   * Filters algorithms to keep only the drafts for the select
   */
  const algorithmsForProduction = useMemo(() => {
    if (algorithms) {
      console.log(algorithms)
      return algorithms.edges
        .filter(algorithm =>
          [AlgorithmStatusEnum.Draft, AlgorithmStatusEnum.Prod, AlgorithmStatusEnum.Test].includes(
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

  const statuses = useMemo(() => {
    if (algorithms && selectedAlgorithmId) {
      const algorithm = algorithms.edges.find(
        algorithm => algorithm.node.id === selectedAlgorithmId
      )

      if (
        algorithm &&
        [AlgorithmStatusEnum.Draft, AlgorithmStatusEnum.Test].includes(
          algorithm.node.status
        )
      ) {
        return Object.values(PublicationStatusEnum).map(status => ({
          label: t(`publicationStatus.${status}`),
          value: status,
        }))
      } else if (algorithm?.node.status === AlgorithmStatusEnum.Prod) {
        return Object.values(PublicationStatusEnum)
          .filter(status => status === PublicationStatusEnum.Prod)
          .map(status => ({
            label: t(`publicationStatus.${status}`),
            value: status,
          }))
      } else {
        return []
      }
    }
  }, [t, selectedAlgorithmId, algorithms])

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
    if (selectedAlgorithmId && selectedStatus) {
      setHasValidationErrors(false)
      publishAlgorithm({
        id: selectedAlgorithmId,
        mode: selectedStatus,
      })
    }
  }

  useEffect(() => {
    if (selectedOption && isSingleValue(selectedOption)) {
      setSelectedAlgorithmId(selectedOption.value)
    } else {
      setSelectedAlgorithmId(null)
      setSelectedStatusOption(null)
      setHasValidationErrors(false)
    }
  }, [selectedOption])

  useEffect(() => {
    if (selectedStatusOption && isSingleValue(selectedStatusOption)) {
      setSelectedStatus(selectedStatusOption.value as PublicationStatusEnum)
    } else {
      setSelectedStatus(null)
      setHasValidationErrors(false)
    }
  }, [selectedStatusOption])

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
                flex: 3,
              }),
            }}
          />
          <Select
            isMulti={false}
            value={selectedStatusOption}
            placeholder={t('statusPlaceholder')}
            onChange={setSelectedStatusOption}
            isSearchable={false}
            isClearable={true}
            options={statuses}
            isDisabled={isReceiving || !selectedOption}
            chakraStyles={{
              container: provided => ({
                ...provided,
                flex: 1,
              }),
            }}
          />
          <Button
            onClick={generate}
            isDisabled={
              !selectedOption || !selectedStatus || isReceiving || isLoading
            }
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
