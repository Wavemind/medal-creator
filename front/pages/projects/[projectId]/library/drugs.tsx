/**
 * The external imports
 */
import { useState, useCallback } from 'react'
import { Button, HStack, Heading, Highlight, Td, Tr } from '@chakra-ui/react'
import { serverSideTranslations } from 'next-i18next/serverSideTranslations'
import { useTranslation } from 'next-i18next'
import { CheckIcon } from '@chakra-ui/icons'
import type { ReactElement } from 'react'
import type { GetServerSidePropsContext } from 'next'

/**
 * The internal imports
 */
import { wrapper } from '@/lib/store'
import Layout from '@/lib/layouts/default'
import { getProject, useGetProjectQuery } from '@/lib/api/modules'
import { apiGraphql } from '@/lib/api/apiGraphql'
import { DataTable, Page, MenuCell } from '@/components'
import { BackIcon } from '@/assets/icons'
import { useLazyGetDrugsQuery } from '@/lib/api/modules/drug'
import type { Drug, LibraryPage, RenderItemFn } from '@/types'

export default function Drugs({ isAdminOrClinician, projectId }: LibraryPage) {
  const { t } = useTranslation('drugs')

  const [isOpen, setIsOpen] = useState(false)

  const { data: project } = useGetProjectQuery(projectId)

  /**
   * Opens the form to create a new drug
   */
  const handleNewClick = (): void => {
    console.log('open the modal')
  }

  /**
   * Callback to the information panel of a drug
   */
  const onDestroy = useCallback((id: number) => {
    console.log('handle destroy', id)
  }, [])

  /**
   * Callback to handle the info action in the table menu
   */
  const onInfo = useCallback((id: number): void => {
    console.log('handle info', id)
  }, [])

  /**
   * Callback to handle the info action in the table menu
   */
  const onEdit = useCallback((id: number): void => {
    console.log('handle edit', id)
  }, [])

  /**
   * Open or close list of diagnoses and fetch releated diagnoses
   */
  const toggleOpen = () => {
    if (!isOpen) {
      console.log('get excluded drugs')
    }
    setIsOpen(prev => !prev)
  }

  /**
   * Row definition for algorithms datatable
   */
  const drugRow = useCallback<RenderItemFn<Drug>>(
    (row, searchTerm) => (
      <Tr data-cy='datatable_row'>
        <Td>
          <Highlight query={searchTerm} styles={{ bg: 'red.100' }}>
            {row.labelTranslations[project?.language.code || 'en']}
          </Highlight>
        </Td>
        <Td textAlign='left'>
          {row.isAntibiotic && <CheckIcon h={8} w={8} color='success' />}
        </Td>
        <Td textAlign='left'>
          {row.isAntiMalarial && <CheckIcon h={8} w={8} color='success' />}
        </Td>
        <Td textAlign='left'>
          {row.isNeonat && <CheckIcon h={8} w={8} color='success' />}
        </Td>
        <Td textAlign='right'>
          <MenuCell
            itemId={row.id}
            onInfo={onInfo}
            onEdit={onEdit}
            onDestroy={onDestroy}
          />
          <Button
            data-cy='datatable_open_diagnosis'
            onClick={toggleOpen}
            variant='link'
            fontSize='xs'
            fontWeight='medium'
            color='primary'
            rightIcon={
              <BackIcon
                sx={{ transform: isOpen ? 'rotate(90deg)' : 'rotate(-90deg)' }}
              />
            }
          >
            {t('showExcludedDrugs')}
          </Button>
        </Td>
      </Tr>
    ),
    [t, isOpen]
  )

  return (
    <Page title={t('title')}>
      <HStack justifyContent='space-between' mb={12}>
        <Heading as='h1'>{t('heading')}</Heading>
        {isAdminOrClinician && (
          <Button
            data-cy='create_variable'
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
