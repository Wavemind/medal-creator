/**
 * The external imports
 */
import { useCallback, useContext } from 'react'
import { Button, Heading, HStack, Spinner } from '@chakra-ui/react'
import { serverSideTranslations } from 'next-i18next/serverSideTranslations'
import { useTranslation } from 'next-i18next'
import type { ReactElement } from 'react'
import type { GetServerSidePropsContext } from 'next'

/**
 * The internal imports
 */
import { DataTable, ManagementForm, ManagementRow, Page } from '@/components'
import { wrapper } from '@/lib/store'
import Layout from '@/lib/layouts/default'
import {
  getProject,
  useGetProjectQuery,
  useLazyGetManagementsQuery,
} from '@/lib/api/modules'
import { apiGraphql } from '@/lib/api/apiGraphql'
import { ModalContext } from '@/lib/contexts'
import type { Management, ManagementPage, RenderItemFn } from '@/types'

export default function Managements({
  projectId,
  isAdminOrClinician,
}: ManagementPage) {
  const { t } = useTranslation('managements')

  const { openModal } = useContext(ModalContext)

  const { data: project, isSuccess: isProjectSuccess } = useGetProjectQuery(
    Number(projectId)
  )

  /**
   * Opens the modal with the algorithm form
   */
  const handleOpenForm = () => {
    openModal({
      title: t('new'),
      content: <ManagementForm projectId={projectId} />,
    })
  }

  /**
   * Row definition for algorithms datatable
   */
  const managementRow = useCallback<RenderItemFn<Management>>(
    (row, searchTerm) => (
      <ManagementRow
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
              data-cy='create_management'
              onClick={handleOpenForm}
              variant='outline'
            >
              {t('createManagement')}
            </Button>
          )}
        </HStack>
        <DataTable
          source='managements'
          searchable
          apiQuery={useLazyGetManagementsQuery}
          requestParams={{ projectId }}
          renderItem={managementRow}
        />
      </Page>
    )
  }

  return <Spinner size='xl' />
}

Managements.getLayout = function getLayout(page: ReactElement) {
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
          'managements',
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
