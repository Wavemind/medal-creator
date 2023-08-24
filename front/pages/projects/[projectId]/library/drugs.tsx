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
import { useLazyGetDrugsQuery } from '@/lib/api/modules/enhanced/drug.enhanced'
import {
  getProject,
  useGetProjectQuery,
} from '@/lib/api/modules/enhanced/project.enhanced'
import DataTable from '@/components/table/datatable'
import Page from '@/components/page'
import DrugRow from '@/components/table/drugRow'
import DrugStepper from '@/components/forms/drugStepper'
import { useModal } from '@/lib/hooks'
import type { Drug, LibraryPage, RenderItemFn } from '@/types'

export default function Drugs({ isAdminOrClinician, projectId }: LibraryPage) {
  const { t } = useTranslation('drugs')
  const { open } = useModal()

  const { data: project, isSuccess: isProjectSuccess } = useGetProjectQuery({
    id: projectId,
  })

  /**
   * Opens the form to create a new drug
   */
  const handleNewClick = (): void => {
    open({
      content: <DrugStepper projectId={projectId} />,
      size: '5xl',
    })
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
        projectId={projectId}
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
              data-testid='create-drug'
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

      if (typeof locale === 'string' && typeof projectId === 'string') {
        const projectResponse = await store.dispatch(
          getProject.initiate({ id: projectId })
        )

        if (projectResponse.isSuccess) {
          // Translations
          const translations = await serverSideTranslations(locale, [
            'common',
            'datatable',
            'projects',
            'drugs',
            'validations',
            'submenu',
            'formulations',
          ])

          return {
            props: {
              projectId,
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
