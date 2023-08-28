/**
 * The external imports
 */
import { useCallback } from 'react'
import { Button, Heading, HStack, Spinner, Td, Tr } from '@chakra-ui/react'
import { serverSideTranslations } from 'next-i18next/serverSideTranslations'
import { useTranslation } from 'next-i18next'
import type { ReactElement } from 'react'
import type { GetServerSidePropsContext } from 'next'

/**
 * The internal imports
 */
import DataTable from '@/components/table/datatable'
import Page from '@/components/page'
import { wrapper } from '@/lib/store'
import Layout from '@/lib/layouts/default'
import {
  getProject,
  useGetProjectQuery,
} from '@/lib/api/modules/enhanced/project.enhanced'
import { useLazyGetManagementsQuery } from '@/lib/api/modules/enhanced/management.enhanced'
import { useModal } from '@/lib/hooks'
import type { LibraryPage, Management, RenderItemFn } from '@/types'

export default function MedicalConditions({
  projectId,
  isAdminOrClinician,
}: LibraryPage) {
  const { t } = useTranslation('medicalConditions')

  const { open } = useModal()

  const { data: project, isSuccess: isProjectSuccess } = useGetProjectQuery({
    id: projectId,
  })

  /**
   * Opens the modal with the algorithm form
   */
  const handleOpenForm = () => {
    // open({
    //   title: t('new'),
    //   content: <ManagementForm projectId={projectId} />,
    // })
  }

  /**
   * Row definition for algorithms datatable
   */
  const medicalConditionsRow = useCallback<RenderItemFn<Management>>(
    (row, searchTerm) => (
      <Tr>
        <Td>Hello</Td>
      </Tr>
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
              data-testid='create-medical-conditions'
              onClick={handleOpenForm}
              variant='outline'
            >
              {t('createMedicalConditions')}
            </Button>
          )}
        </HStack>
        <DataTable
          source='medicalConditions'
          searchable
          apiQuery={useLazyGetManagementsQuery}
          requestParams={{ projectId }}
          renderItem={medicalConditionsRow}
        />
      </Page>
    )
  }

  return <Spinner size='xl' />
}

MedicalConditions.getLayout = function getLayout(page: ReactElement) {
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
            'medicalConditions',
            'validations',
            'submenu',
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
