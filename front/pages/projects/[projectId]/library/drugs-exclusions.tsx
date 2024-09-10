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
import DataTable from '@/components/table/datatable'
import DiagnosisExclusionRow from '@/components/table/diagnosisExclusionRow'
import Layout from '@/lib/layouts/default'
import { wrapper } from '@/lib/store'
import { extractTranslation } from '@/lib/utils/string'
import { useProject } from '@/lib/hooks/useProject'
import { useToast } from '@/lib/hooks/useToast'
import { useAppRouter } from '@/lib/hooks/useAppRouter'
import {
  useCreateNodeExclusionsMutation,
  useLazyGetDiagnosesExclusionsQuery,
} from '@/lib/api/modules/enhanced/nodeExclusion.enhanced'
import { useLazyGetDrugsQuery } from '@/lib/api/modules/enhanced/drug.enhanced'
import { NodeExclusion, Option, RenderItemFn } from '@/types'

const DiagnosisExclusions = () => {
  const { t } = useTranslation('drugsExclusions')
  const { newToast } = useToast()
  const { projectLanguage, isAdminOrClinician } = useProject()
  const {
    query: { projectId },
  } = useAppRouter()

  const [excludingOption, setExcludingOption] =
    useState<SingleValue<Option>>(null)
  const [excludedOption, setExcludedOption] =
    useState<SingleValue<Option>>(null)

  const [getDrugs] = useLazyGetDrugsQuery()

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
        const response = await getDrugs({
          projectId,
          searchTerm: inputValue,
          first: 10,
        })

        if (response.isSuccess) {
          let tempOptions = response.data.edges
          if (optionToExclude) {
            tempOptions = tempOptions.filter(
              drug => drug.node.id !== optionToExclude.value
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
          nodeType: 'drug',
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

  return (
    <Page title={t('title')}>
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
                // isDisabled={isRestricted}
                defaultOptions
                placeholder={t('excludingDrugPlaceholder')}
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
                // isDisabled={isRestricted}
                defaultOptions
                placeholder={t('excludedDrugPlaceholder')}
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
                // isDisabled={!isRestricted}
              >
                <Button
                  onClick={addExclusion}
                  isDisabled={!excludedOption || !excludingOption}
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
      {/* <DataTable
          source='drugsExclusions'
          searchable
          apiQuery={useLazyGetDiagnosesExclusionsQuery}
          requestParams={{ algorithmId }}
          renderItem={diagnosisExclusionRow}
        /> */}
    </Page>
  )
}

export default DiagnosisExclusions

DiagnosisExclusions.getLayout = function getLayout(page: ReactElement) {
  return <Layout menuType='library'>{page}</Layout>
}

export const getServerSideProps = wrapper.getServerSideProps(
  () =>
    async ({ locale }: GetServerSidePropsContext) => {
      if (typeof locale === 'string') {
        // Translations
        const translations = await serverSideTranslations(locale, [
          'common',
          'submenu',
          'algorithms',
          'drugsExclusions',
          'validations',
          'datatable',
        ])

        return {
          props: {
            locale,
            ...translations,
          },
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
