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
import { useAppRouter } from '@/lib/hooks/useAppRouter'
import { useModal } from '@/lib/hooks/useModal'
import { useProject } from '@/lib/hooks/useProject'
import type { Management, RenderItemFn } from '@/types'

export default function Managements() {
  const { t } = useTranslation('managements')
  const { isAdminOrClinician, projectLanguage } = useProject()
  const {
    query: { projectId },
  } = useAppRouter()

  const { open } = useModal()

  /**
   * Opens the modal with the algorithm form
   */
  const handleOpenForm = () => {
    open({
      title: t('new'),
      content: <ManagementForm />,
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
    async ({ locale }: GetServerSidePropsContext) => {
      if (typeof locale === 'string') {
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
