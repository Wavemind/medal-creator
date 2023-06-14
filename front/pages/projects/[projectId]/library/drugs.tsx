/**
 * The external imports
 */
import { useCallback } from 'react'
import { Button, HStack, Heading, Spinner } from '@chakra-ui/react'
import { serverSideTranslations } from 'next-i18next/serverSideTranslations'
import { useTranslation } from 'next-i18next'
import type { ReactElement } from 'react'
import type { GetServerSidePropsContext } from 'next'

/**
 * The internal imports
 */
import { wrapper } from '@/lib/store'
import Layout from '@/lib/layouts/default'
import { getProject, useGetProjectQuery } from '@/lib/api/modules'
import { apiGraphql } from '@/lib/api/apiGraphql'
import { DataTable, Page, DrugRow } from '@/components'
import { useLazyGetDrugsQuery } from '@/lib/api/modules/drug'
import type { Drug, LibraryPage, RenderItemFn } from '@/types'

export default function Drugs({ isAdminOrClinician, projectId }: LibraryPage) {
  const { t } = useTranslation('drugs')

  const { data: project, isSuccess: isProjectSuccess } =
    useGetProjectQuery(projectId)

  /**
   * Opens the form to create a new drug
   */
  const handleNewClick = (): void => {
    console.log('open the modal')
  }

  /**
   * Row definition for drugs datatable
   */
  const drugRow = useCallback<RenderItemFn<Drug>>(
    (row, searchTerm) => (
      <DrugRow
        row={row}
        searchTerm={searchTerm}
        language={project!.language.code}
        isAdminOrClinician={isAdminOrClinician}
      />
    ),
    [t]
  )

  if (isProjectSuccess) {
    return (
      <Page title={t('title')}>
        <HStack justifyContent='space-between' mb={12}>
          <Heading as='h1'>{t('heading')}</Heading>
          {isAdminOrClinician && (
            <Button
              data-cy='create_drug'
              onClick={handleNewClick}
              variant='outline'
            >
              {t('createDrug')}
            </Button>
          )}
        </HStack>
        <DataTable
          source='drugs'
          searchable
          searchPlaceholder={t('searchPlaceholder')}
          apiQuery={useLazyGetDrugsQuery}
          requestParams={{ projectId }}
          renderItem={drugRow}
        />
      </Page>
    )
  }
  return <Spinner size='xl' />
}

Drugs.getLayout = function getLayout(page: ReactElement) {
  return <Layout menuType='library'>{page}</Layout>
}

export const getServerSideProps = wrapper.getServerSideProps(
  store =>
    async ({ locale, query }: GetServerSidePropsContext) => {
      const { projectId } = query

      if (typeof locale === 'string') {
        store.dispatch(getProject.initiate(Number(projectId)))
        await Promise.all(
          store.dispatch(apiGraphql.util.getRunningQueriesThunk())
        )

        // Translations
        const translations = await serverSideTranslations(locale, [
          'common',
          'datatable',
          'projects',
          'drugs',
          'validations',
          'submenu',
        ])

        return {
          props: {
            projectId,
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
