/**
 * The external imports
 */
import { useCallback } from 'react'
import {
  Button,
  Heading,
  Highlight,
  HStack,
  Spinner,
  Tag,
  Td,
  Tr,
  VStack,
  Text,
} from '@chakra-ui/react'
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
import { useLazyGetQuestionsSequencesQuery } from '@/lib/api/modules/enhanced/questionSequences.enhanced'
import { useModal, useAlertDialog } from '@/lib/hooks'
import MenuCell from '@/components/table/menuCell'
import { extractTranslation } from '@/lib/utils/string'
import DiagramButton from '@/components/diagramButton'
import QuestionSequencesForm from '@/components/forms/questionSequences'
import type {
  LibraryPage,
  RenderItemFn,
  QuestionsSequence,
  Scalars,
} from '@/types'

export default function MedicalConditions({
  projectId,
  isAdminOrClinician,
}: LibraryPage) {
  const { t } = useTranslation('questionsSequence')

  const { open: openAlertDialog } = useAlertDialog()
  const { open } = useModal()

  const { data: project, isSuccess: isProjectSuccess } = useGetProjectQuery({
    id: projectId,
  })

  const handleOpenForm = () => {
    open({
      title: t('new'),
      content: <QuestionSequencesForm projectId={projectId} />,
    })
  }

  const onDestroy = useCallback(
    (questionSequencesId: Scalars['ID']) => {
      openAlertDialog({
        title: t('delete', { ns: 'datatable' }),
        content: t('areYouSure', { ns: 'common' }),
        // action: () => destroyVariable({ id: questionSequencesId }),
      })
    },
    [t]
  )

  const medicalConditionsRow = useCallback<RenderItemFn<QuestionsSequence>>(
    (row, searchTerm) => (
      <Tr data-testid='datatable-row'>
        <Td>
          <VStack alignItems='left'>
            <Text fontSize='sm' fontWeight='light'>
              {row.fullReference}
            </Text>
            <Highlight query={searchTerm} styles={{ bg: 'red.100' }}>
              {extractTranslation(
                row.labelTranslations,
                project!.language.code
              )}
            </Highlight>
          </VStack>
        </Td>

        <Td>
          {t(`categories.${row.type}.label`, {
            ns: 'variables',
            defaultValue: '',
          })}
        </Td>
        <Td>
          {row.nodeComplaintCategories?.map(ncc => (
            <Tag mx={1} key={`${row.id}-${ncc.id}`}>
              {extractTranslation(
                ncc.complaintCategory.labelTranslations,
                project!.language.code
              )}
            </Tag>
          ))}
        </Td>
        <Td>
          {/* TODO : insert correct instanceableType */}
          <DiagramButton
            href={`/projects/${projectId}/diagram/decision-tree/${row.id}`}
            label={t('openMedicalConditions')}
          />
        </Td>
        <Td>
          <MenuCell
            itemId={row.id}
            onDestroy={isAdminOrClinician ? onDestroy : undefined}
            canDestroy={!row.hasInstances && !row.isDefault}
          />
        </Td>
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
          apiQuery={useLazyGetQuestionsSequencesQuery}
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
            'questionsSequence',
            'decisionTrees',
            'validations',
            'variables',
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
