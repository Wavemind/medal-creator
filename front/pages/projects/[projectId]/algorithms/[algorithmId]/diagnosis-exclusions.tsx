/**
 * The external imports
 */
import React, { FC, ReactElement, useCallback, useMemo, useState } from 'react'
import { serverSideTranslations } from 'next-i18next/serverSideTranslations'
import { Button, Heading, HStack, Spinner, Text } from '@chakra-ui/react'
import { useTranslation } from 'next-i18next'
import type { GetServerSidePropsContext } from 'next/types'

/**
 * The internal imports
 */
import Layout from '@/lib/layouts/default'
import Page from '@/components/page'
import { wrapper } from '@/lib/store'
import {
  getAlgorithmMedalDataConfig,
  useGetAlgorithmMedalDataConfigQuery,
} from '@/lib/api/modules/enhanced/algorithm.enhanced'
import Card from '@/components/card'
import { Select, SingleValue } from 'chakra-react-select'
import {
  getDiagnoses,
  useGetDiagnosesQuery,
} from '@/lib/api/modules/enhanced/diagnosis.enhanced'
import { extractTranslation } from '@/lib/utils/string'
import { useProject } from '@/lib/hooks'
import type { AlgorithmId, DecisionTree, Option, RenderItemFn } from '@/types'
import DataTable from '@/components/table/datatable'
import { useLazyGetDecisionTreesQuery } from '@/lib/api/modules/enhanced/decisionTree.enhanced'

const DiagnosisExclusions: FC<AlgorithmId> = ({ algorithmId }) => {
  const { t } = useTranslation('diagnosisExclusions')

  const [excludingOption, setExcludingOption] =
    useState<SingleValue<Option>>(null)
  const [excludedOption, setExcludedOption] =
    useState<SingleValue<Option>>(null)

  const { projectLanguage } = useProject()

  // TODO : Mettre algorithm dans un context comme on a fait avec project ?
  const { data: algorithm, isSuccess: isAlgorithmSuccess } =
    useGetAlgorithmMedalDataConfigQuery({ id: algorithmId })

  // TODO : Get diagnoses is paginated yet we never have a list of diagnoses in a datatable
  // (only used in decisionTreeRow and decisionTreeSummary)
  // Do we need to keep the pagination ? If yes, we may need a new query here to get all diagnoses
  // for an algo or we need to specify first 100 to make sure we get all of em
  const { data: diagnoses, isSuccess: isDiagnosesSuccess } =
    useGetDiagnosesQuery({ algorithmId })

  const excludingDiagnoses = useMemo(() => {
    if (diagnoses) {
      return diagnoses.edges.map(diagnosis => ({
        label: extractTranslation(
          diagnosis.node.labelTranslations,
          projectLanguage
        ),
        value: diagnosis.node.id,
      }))
    }
  }, [diagnoses])

  const excludedDiagnoses = useMemo(() => {
    if (diagnoses) {
      let tempDiagnoses = diagnoses.edges
      if (excludingOption) {
        tempDiagnoses = tempDiagnoses.filter(
          diagnosis => diagnosis.node.id !== excludingOption.value
        )
      }
      return tempDiagnoses.map(diagnosis => ({
        label: extractTranslation(
          diagnosis.node.labelTranslations,
          projectLanguage
        ),
        value: diagnosis.node.id,
      }))
    }
  }, [diagnoses, excludingOption])

  /**
   * One row of decision tree
   */
  const decisionTreeRow = useCallback<RenderItemFn<DecisionTree>>(
    (row, searchTerm) => (
      <decisionTreeRow row={row} searchTerm={''} language={projectLanguage} />
    ),
    [t]
  )

  const addExclusion = () => {
    console.log('TODO')
  }

  if (isAlgorithmSuccess && isDiagnosesSuccess) {
    return (
      <Page title={algorithm.name}>
        <HStack justifyContent='space-between' mb={12}>
          <Heading as='h1'>{t('title')}</Heading>
        </HStack>

        <Card px={4} py={5}>
          <HStack spacing={12}>
            <Select
              isClearable
              value={excludingOption}
              options={excludingDiagnoses}
              onChange={setExcludingOption}
              chakraStyles={{
                container: provided => ({
                  ...provided,
                  flex: 1,
                }),
              }}
            />
            <Text>Excludes</Text>
            <Select
              isClearable
              value={excludedOption}
              options={excludedDiagnoses}
              onChange={setExcludedOption}
              chakraStyles={{
                container: provided => ({
                  ...provided,
                  flex: 1,
                }),
              }}
            />
            <Button onClick={addExclusion}>{t('add', { ns: 'common' })}</Button>
          </HStack>
        </Card>
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
