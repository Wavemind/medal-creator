/**
 * The external imports
 */
import { useContext, useState, type ReactElement, useCallback } from 'react'
import {
  Button,
  HStack,
  Heading,
  Highlight,
  Tab,
  TabIndicator,
  TabList,
  TabPanel,
  TabPanels,
  Tabs,
  Td,
  Tooltip,
  Tr,
} from '@chakra-ui/react'
import { serverSideTranslations } from 'next-i18next/serverSideTranslations'
import { useTranslation } from 'next-i18next'
import { CheckIcon } from '@chakra-ui/icons'
import type { GetServerSidePropsContext } from 'next'

/**
 * The internal imports
 */
import { wrapper } from '@/lib/store'
import Layout from '@/lib/layouts/default'
import { getProject, useGetProjectQuery } from '@/lib/api/modules'
import { apiGraphql } from '@/lib/api/apiGraphql'
import { AlertDialogContext, ModalContext } from '@/lib/contexts'
import { DataTable, Page, MenuCell } from '@/components'
import { BackIcon } from '@/assets/icons'
import { useLazyGetDrugsQuery } from '@/lib/api/modules/drug'
import type { Drug, LibraryPage, RenderItemFn } from '@/types'

export default function Drugs({ isAdminOrClinician, projectId }: LibraryPage) {
  const { t } = useTranslation('drugs')

  const [isOpen, setIsOpen] = useState(false)

  const { openAlertDialog } = useContext(AlertDialogContext)
  const { openModal } = useContext(ModalContext)

  const { data: project } = useGetProjectQuery(projectId)

  /**
   * Opens the form to create a new variable
   */
  const handleNewClick = (): void => {
    console.log('open the modal')
  }

  /**
   * Opens the form to edit a new variable
   */
  const handleEditClick = (id: number): void => {
    console.log('Open the edit modal', id)
  }

  /**
   * Callback to handle the suppression of a decision tree
   */
  const onDestroy = useCallback((id: number) => {
    console.log('handle destroy', id)
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
        <Td textAlign='center'>
          {row.isAntibiotic && <CheckIcon h={8} w={8} color='success' />}
        </Td>
        <Td textAlign='center'>
          {row.isAntiMalarial && <CheckIcon h={8} w={8} color='success' />}
        </Td>
        <Td textAlign='center'>
          {row.isNeonat && <CheckIcon h={8} w={8} color='success' />}
        </Td>
        <Td>
          {isAdminOrClinician && (
            <Tooltip label={t('hasInstances', { ns: 'datatable' })} hasArrow>
              <Button
                data-cy='variable_edit_button'
                onClick={() => handleEditClick(row.id)}
                minW={24}
              >
                {t('edit', { ns: 'datatable' })}
              </Button>
            </Tooltip>
          )}
        </Td>
        <Td textAlign='right'>
          <MenuCell
            itemId={row.id}
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
    [t]
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
      <Tabs position='relative' variant='unstyled'>
        <TabList color='primary' justifyContent='center'>
          <Tab fontSize={18} _selected={{ fontWeight: 'semibold' }}>
            Drugs
          </Tab>
          <Tab fontSize={18} _selected={{ fontWeight: 'semibold' }}>
            Drugs exclusions
          </Tab>
        </TabList>
        <TabIndicator mt={-1} height={1} bg='primary' />
        <TabPanels>
          <TabPanel>
            <DataTable
              source='drugs'
              searchable
              apiQuery={useLazyGetDrugsQuery}
              requestParams={{ projectId }}
              renderItem={drugRow}
            />
          </TabPanel>
          <TabPanel>
            <p>two!</p>
          </TabPanel>
        </TabPanels>
      </Tabs>
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
