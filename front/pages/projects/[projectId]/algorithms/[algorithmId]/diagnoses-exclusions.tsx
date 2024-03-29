/**
 * The external imports
 */
import React, { ReactElement, useCallback, useState, useEffect } from 'react'
import { serverSideTranslations } from 'next-i18next/serverSideTranslations'
import {
  Button,
  Heading,
  HStack,
  Spinner,
  Text,
  Tooltip,
  VStack,
} from '@chakra-ui/react'
import { useTranslation } from 'next-i18next'
import {
  AsyncSelect,
  type GroupBase,
  type OptionsOrGroups,
  type SingleValue,
} from 'chakra-react-select'
import type { GetServerSidePropsContext } from 'next/types'

/**
 * The internal imports
 */
import Page from '@/components/page'
import ErrorMessage from '@/components/errorMessage'
import Card from '@/components/card'
import Layout from '@/lib/layouts/default'
import DiagnosisExclusionRow from '@/components/table/diagnosisExclusionRow'
import { wrapper } from '@/lib/store'
import DataTable from '@/components/table/datatable'
import { getAlgorithm } from '@/lib/api/modules/enhanced/algorithm.enhanced'
import { useLazyGetDiagnosesQuery } from '@/lib/api/modules/enhanced/diagnosis.enhanced'
import { extractTranslation } from '@/lib/utils/string'
import { useProject } from '@/lib/hooks/useProject'
import { useToast } from '@/lib/hooks/useToast'
import { useAlgorithm } from '@/lib/hooks/useAlgorithm'
import {
  useCreateNodeExclusionsMutation,
  useLazyGetDiagnosesExclusionsQuery,
} from '@/lib/api/modules/enhanced/nodeExclusion.enhanced'
import { AlgorithmId, NodeExclusion, Option, RenderItemFn } from '@/types'

const DiagnosisExclusions = ({ algorithmId }: AlgorithmId) => {
  const { t } = useTranslation('diagnosisExclusions')
  const { newToast } = useToast()
  const { projectLanguage, isAdminOrClinician } = useProject()

  const [excludingOption, setExcludingOption] =
    useState<SingleValue<Option>>(null)
  const [excludedOption, setExcludedOption] =
    useState<SingleValue<Option>>(null)

  const { algorithm, isRestricted } = useAlgorithm(algorithmId)

  const [getDiagnoses] = useLazyGetDiagnosesQuery()

  const [createNodeExclusions, { isSuccess, isError, error }] =
    useCreateNodeExclusionsMutation()

  const loadOptions = useCallback(
    (
      inputValue: string,
      callback: (options: OptionsOrGroups<Option, GroupBase<Option>>) => void,
      optionToExclude: SingleValue<Option>
    ) => {
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
          if (optionToExclude) {
            tempOptions = tempOptions.filter(
              diagnosis => diagnosis.node.id !== optionToExclude.value
            )
          }
          const options = tempOptions.map(edge => ({
            label: `${edge.node.fullReference} - ${extractTranslation(
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

  const diagnosisExclusionRow = useCallback<RenderItemFn<NodeExclusion>>(
    (row, searchTerm) => (
      <DiagnosisExclusionRow row={row} searchTerm={searchTerm} />
    ),
    [t]
  )

  const addExclusion = () => {
    if (excludedOption && excludingOption) {
      createNodeExclusions({
        params: {
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

  if (algorithm) {
    return (
      <Page title={algorithm.name}>
        <HStack justifyContent='space-between' mb={12}>
          <Heading as='h1'>{t('title')}</Heading>
        </HStack>

        {isAdminOrClinician && (
          <Card px={4} py={5}>
            <VStack w='full' alignItems='flex-start'>
              <HStack spacing={12} w='full'>
                <AsyncSelect<Option>
                  inputId='excludingDiagnosis'
                  isClearable
                  isDisabled={isRestricted}
                  defaultOptions
                  placeholder={t('excludingDiagnosisPlaceholder')}
                  value={excludingOption}
                  onChange={setExcludingOption}
                  loadOptions={(inputValue, callback) =>
                    loadOptions(inputValue, callback, excludedOption)
                  }
                  chakraStyles={{
                    container: provided => ({
                      ...provided,
                      flex: 1,
                    }),
                  }}
                />
                <Text>{t('excludes')}</Text>
                <AsyncSelect<Option>
                  inputId='excludedDiagnosis'
                  isClearable
                  isDisabled={isRestricted}
                  defaultOptions
                  placeholder={t('excludedDiagnosisPlaceholder')}
                  value={excludedOption}
                  onChange={setExcludedOption}
                  loadOptions={(inputValue, callback) =>
                    loadOptions(inputValue, callback, excludingOption)
                  }
                  chakraStyles={{
                    container: provided => ({
                      ...provided,
                      flex: 1,
                    }),
                  }}
                />
                <Tooltip
                  label={t('tooltip.inProduction', { ns: 'datatable' })}
                  hasArrow
                  isDisabled={!isRestricted}
                >
                  <Button
                    onClick={addExclusion}
                    isDisabled={
                      !excludedOption || !excludingOption || isRestricted
                    }
                  >
                    {t('add', { ns: 'common' })}
                  </Button>
                </Tooltip>
              </HStack>
              {isError && (
                <ErrorMessage error={error} errorKey='excluded_node_id' />
              )}
            </VStack>
          </Card>
        )}
        <DataTable
          source='diagnosesExclusions'
          searchable
          apiQuery={useLazyGetDiagnosesExclusionsQuery}
          requestParams={{ algorithmId }}
          renderItem={diagnosisExclusionRow}
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
          getAlgorithm.initiate({ id: algorithmId })
        )

        if (algorithmResponse.isSuccess) {
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
