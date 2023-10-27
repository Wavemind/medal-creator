/**
 * The external imports
 */
import React, { ReactElement, useCallback, useState, useEffect } from 'react'
import { serverSideTranslations } from 'next-i18next/serverSideTranslations'
import { Button, Heading, HStack, Spinner, Text } from '@chakra-ui/react'
import { useTranslation } from 'next-i18next'
import { AsyncSelect, type SingleValue } from 'chakra-react-select'
import type { GetServerSidePropsContext } from 'next/types'

/**
 * The internal imports
 */
import Page from '@/components/page'
import ErrorMessage from '@/components/errorMessage'
import Layout from '@/lib/layouts/default'
import { wrapper } from '@/lib/store'
import {
  getAlgorithmMedalDataConfig,
  useGetAlgorithmMedalDataConfigQuery,
} from '@/lib/api/modules/enhanced/algorithm.enhanced'
import Card from '@/components/card'
import {
  getDiagnoses,
  useLazyGetDiagnosesQuery,
} from '@/lib/api/modules/enhanced/diagnosis.enhanced'
import { extractTranslation } from '@/lib/utils/string'
import { useProject, useToast } from '@/lib/hooks'
import DataTable from '@/components/table/datatable'
import DecisionTreeRow from '@/components/table/decisionTreeRow'
import { useLazyGetDecisionTreesQuery } from '@/lib/api/modules/enhanced/decisionTree.enhanced'
import { useCreateNodeExclusionsMutation } from '@/lib/api/modules/enhanced/nodeExclusion.enhanced'
import type { AlgorithmId, DecisionTree, Option, RenderItemFn } from '@/types'

const DiagnosisExclusions = ({ algorithmId }: AlgorithmId) => {
  const { t } = useTranslation('diagnosisExclusions')
  const { newToast } = useToast()
  const { projectLanguage } = useProject()

  const [excludingOption, setExcludingOption] =
    useState<SingleValue<Option>>(null)
  const [excludedOption, setExcludedOption] =
    useState<SingleValue<Option>>(null)

  // TODO : Mettre algorithm dans un context comme on a fait avec project ?
  const { data: algorithm, isSuccess: isAlgorithmSuccess } =
    useGetAlgorithmMedalDataConfigQuery({ id: algorithmId })

  const [getDiagnoses] = useLazyGetDiagnosesQuery()

  const [createNodeExclusions, { isSuccess, isError, error }] =
    useCreateNodeExclusionsMutation()

  /**
   * Implement debouncing of excluding options using a setTimeout
   */
  const loadExcludingOptions = useCallback(
    (inputValue: string, callback: any) => {
      let timeoutId: NodeJS.Timeout | null = null

      // Clear any previous timeouts
      if (timeoutId) {
        clearTimeout(timeoutId)
      }

      timeoutId = setTimeout(async () => {
        const response = await getDiagnoses({
          algorithmId,
          searchTerm: inputValue,
          first: 10,
        })

        if (response.isSuccess) {
          const options = response.data.edges.map(edge => ({
            label: `${edge.node.id} - ${extractTranslation(
              edge.node.labelTranslations,
              projectLanguage
            )}`,
            value: edge.node.id,
          }))
          callback(options)
        }
      }, 300)
    },
    []
  )

  /**
   * Implement debouncing of excluded options using a setTimeout
   */
  const loadExcludedOptions = useCallback(
    (inputValue: string, callback: any) => {
      let timeoutId: NodeJS.Timeout | null = null

      // Clear any previous timeouts
      if (timeoutId) {
        clearTimeout(timeoutId)
      }

      timeoutId = setTimeout(async () => {
        const response = await getDiagnoses({
          algorithmId,
          searchTerm: inputValue,
          first: 10,
        })

        if (response.isSuccess) {
          let tempOptions = response.data.edges
          if (excludingOption) {
            tempOptions = tempOptions.filter(
              diagnosis => diagnosis.node.id !== excludingOption.value
            )
          }
          const options = tempOptions.map(edge => ({
            label: `${edge.node.id} - ${extractTranslation(
              edge.node.labelTranslations,
              projectLanguage
            )}`,
            value: edge.node.id,
          }))
          callback(options)
        }
      }, 300)
    },
    [excludingOption]
  )

  /**
   * One row of decision tree
   */
  // TODO : Replace by row of exclusion
  const decisionTreeRow = useCallback<RenderItemFn<DecisionTree>>(
    row => (
      <DecisionTreeRow row={row} searchTerm={''} language={projectLanguage} />
    ),
    [t]
  )

  const addExclusion = () => {
    if (excludedOption && excludingOption) {
      createNodeExclusions({
        params: {
          // TODO : NodeTypeEnum ?
          nodeType: 'diagnosis',
          excludingNodeId: excludingOption.value,
          excludedNodeId: excludedOption.value,
        },
      })
    }
  }

  useEffect(() => {
    if (isSuccess) {
      setExcludingOption(null)
      setExcludedOption(null)
      newToast({
        message: t('notifications.saveSuccess', { ns: 'common' }),
        status: 'success',
      })
    }
  }, [isSuccess])

  if (isAlgorithmSuccess) {
    return (
      <Page title={algorithm.name}>
        <HStack justifyContent='space-between' mb={12}>
          <Heading as='h1'>{t('title')}</Heading>
        </HStack>

        <Card px={4} py={5}>
          <HStack spacing={12}>
            <AsyncSelect
              isClearable
              placeholder='Excluding diagnosis'
              value={excludingOption}
              onChange={setExcludingOption}
              loadOptions={loadExcludingOptions}
              chakraStyles={{
                container: provided => ({
                  ...provided,
                  flex: 1,
                }),
              }}
            />
            <Text>Excludes</Text>
            <AsyncSelect
              isClearable
              placeholder='Excluded diagnosis'
              value={excludedOption}
              onChange={setExcludedOption}
              loadOptions={loadExcludedOptions}
              chakraStyles={{
                container: provided => ({
                  ...provided,
                  flex: 1,
                }),
              }}
            />
            <Button
              onClick={addExclusion}
              isDisabled={!excludedOption || !excludingOption}
            >
              {t('add', { ns: 'common' })}
            </Button>
          </HStack>
          {isError && <ErrorMessage error={error} />}
        </Card>
        {/* TODO : Replace decision trees with excluding nodes datatable once we have the query */}
        <DataTable
          source='decisionTrees'
          searchable
          apiQuery={useLazyGetDecisionTreesQuery}
          requestParams={{ algorithmId }}
          renderItem={decisionTreeRow}
        />
      </Page>
    )
  }

  return <Spinner size='xl' />
}

export default DiagnosisExclusions

DiagnosisExclusions.getLayout = function getLayout(page: ReactElement) {
  return <Layout menuType='algorithm'>{page}</Layout>
}

export const getServerSideProps = wrapper.getServerSideProps(
  store =>
    async ({ locale, query }: GetServerSidePropsContext) => {
      const { algorithmId } = query

      if (typeof locale === 'string' && typeof algorithmId === 'string') {
        const algorithmResponse = await store.dispatch(
          getAlgorithmMedalDataConfig.initiate({ id: algorithmId })
        )

        const diagnosesResponse = await store.dispatch(
          getDiagnoses.initiate({ algorithmId })
        )

        if (algorithmResponse.isSuccess && diagnosesResponse.isSuccess) {
          // Translations
          const translations = await serverSideTranslations(locale, [
            'common',
            'submenu',
            'algorithms',
            'diagnosisExclusions',
            'validations',
            'datatable',
          ])

          return {
            props: {
              algorithmId,
              locale,
              ...translations,
            },
          }
        } else {
          return {
            notFound: true,
          }
        }
      }

      return {
        redirect: {
          destination: '/500',
          permanent: false,
        },
      }
    }
)
