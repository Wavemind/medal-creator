/**
 * The external imports
 */
import React, { useMemo, useState } from 'react'
import { Text, HStack, VStack, Button, Spinner, Icon } from '@chakra-ui/react'
import { useTranslation } from 'next-i18next'
import { BsFillCheckCircleFill, BsFillXCircleFill } from 'react-icons/bs'
import { Select, type SingleValue } from 'chakra-react-select'

/**
 * The internal imports
 */
import { useAppRouter } from '@/lib/hooks'
import Card from '@/components/card'
import { useGetAlgorithmsQuery } from '@/lib/api/modules/enhanced/algorithm.enhanced'
import { AlgorithmStatusEnum, type Option } from '@/types'

const Publish = () => {
  const { t } = useTranslation('publication')

  const [selectedOption, setSelectedOption] =
    useState<SingleValue<Option>>(null)
  const [generating, setGenerating] = useState(false)
  // TODO : Probably get these from the query ?
  const [isGenerationSuccess, setIsGenerationSuccess] = useState(false)
  const [isGenerationError, setIsGenerationError] = useState(false)

  const {
    query: { projectId },
  } = useAppRouter()

  const { data: algorithms } = useGetAlgorithmsQuery({
    projectId,
    filters: {
      statuses: [AlgorithmStatusEnum.Draft, AlgorithmStatusEnum.Prod],
    },
  })

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

  const generate = () => {
    console.log('TODO : generate')
    setGenerating(true)
  }

  return (
    <Card px={4} pt={3} pb={8}>
      <VStack w='full' alignItems='flex-start' spacing={4}>
        <HStack w='full' spacing={7}>
          <Select
            placeholder={t('placeholder')}
            onChange={setSelectedOption}
            isSearchable={false}
            isClearable={true}
            options={drafts}
            chakraStyles={{
              container: provided => ({
                ...provided,
                width: '100%',
              }),
            }}
          />
          <Button onClick={generate} isDisabled={!selectedOption || generating}>
            {t('generate')}
          </Button>
        </HStack>
        <Text fontSize='xs'>{t('instructions')}</Text>
        {selectedOption && (
          <HStack spacing={5}>
            {generating && <Spinner />}
            {isGenerationSuccess && (
              <Icon as={BsFillCheckCircleFill} color='success' h={6} w={6} />
            )}
            {isGenerationError && (
              <Icon as={BsFillXCircleFill} color='error' h={6} w={6} />
            )}
            <Text>{selectedOption.label}</Text>
            {isGenerationError && (
              <Text color='error' fontSize='xs'>
                {t('generationError')}
              </Text>
            )}
          </HStack>
        )}
      </VStack>
    </Card>
  )
}

export default Publish
