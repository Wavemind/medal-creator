/**
 * The external imports
 */
import { useCallback } from 'react'
import { Button, Heading, HStack } from '@chakra-ui/react'
import { serverSideTranslations } from 'next-i18next/serverSideTranslations'
import { useTranslation } from 'next-i18next'
import type { ReactElement } from 'react'
import type { GetServerSidePropsContext } from 'next'

/**
 * The internal imports
 */
import DataTable from '@/components/table/datatable'
import ManagementForm from '@/components/forms/management'
import ManagementRow from '@/components/table/managementRow'
import Page from '@/components/page'
import { wrapper } from '@/lib/store'
import Layout from '@/lib/layouts/default'
import { useLazyGetManagementsQuery } from '@/lib/api/modules/enhanced/management.enhanced'
import { useModal, useProject } from '@/lib/hooks'
import type { LibraryPage, Management, RenderItemFn } from '@/types'

export default function Managements({ projectId }: LibraryPage) {
  const { t } = useTranslation('managements')
  const { isAdminOrClinician, projectLanguage } = useProject()

  const { open } = useModal()

  /**
   * Opens the modal with the algorithm form
   */
  const handleOpenForm = () => {
    open({
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
        language={projectLanguage}
        projectId={projectId}
      />
    ),
    [t]
  )

  return (
    <Page title={t('title')}>
      <HStack justifyContent='space-between' mb={12}>
        <Heading as='h1'>{t('heading')}</Heading>
        {isAdminOrClinician && (
          <Button
            data-testid='create-management'
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

Managements.getLayout = function getLayout(page: ReactElement) {
  return <Layout menuType='library'>{page}</Layout>
}

export const getServerSideProps = wrapper.getServerSideProps(
  () =>
    async ({ locale, query }: GetServerSidePropsContext) => {
      const { projectId } = query

      if (typeof locale === 'string' && typeof projectId === 'string') {
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
