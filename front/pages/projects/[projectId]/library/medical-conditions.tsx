/**
 * The external imports
 */
import { useCallback, useEffect } from 'react'
import {
  Button,
  Heading,
  Highlight,
  HStack,
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
  useDestroyQuestionsSequenceMutation,
  useLazyGetQuestionsSequencesQuery,
} from '@/lib/api/modules/enhanced/questionSequences.enhanced'
import { useModal, useAlertDialog, useToast, useProject } from '@/lib/hooks'
import { extractTranslation } from '@/lib/utils/string'
import MenuCell from '@/components/table/menuCell'
import DiagramButton from '@/components/diagramButton'
import QuestionSequencesForm from '@/components/forms/questionsSequence'
import type {
  LibraryPage,
  RenderItemFn,
  QuestionsSequence,
  Scalars,
} from '@/types'

export default function MedicalConditions({ projectId }: LibraryPage) {
  const { t } = useTranslation('questionsSequence')
  const { newToast } = useToast()
  const { open: openAlertDialog } = useAlertDialog()
  const { open: openModal } = useModal()
  const { isAdminOrClinician, projectLanguage } = useProject()

  const [
    destroyQuestionsSequence,
    { isSuccess: isDestroySuccess, isError: isDestroyError },
  ] = useDestroyQuestionsSequenceMutation()

  const handleOpenForm = () => {
    openModal({
      title: t('new'),
      content: <QuestionSequencesForm projectId={projectId} />,
    })
  }

  const onDestroy = useCallback(
    (questionSequencesId: Scalars['ID']) => {
      openAlertDialog({
        title: t('delete', { ns: 'datatable' }),
        content: t('areYouSure', { ns: 'common' }),
        action: () => destroyQuestionsSequence({ id: questionSequencesId }),
      })
    },
    [t]
  )

  const handleEditQuestionsSequence = useCallback(
    (questionSequencesId: Scalars['ID']) =>
      openModal({
        title: t('edit'),
        content: (
          <QuestionSequencesForm
            questionsSequenceId={questionSequencesId}
            projectId={projectId}
          />
        ),
      }),
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
            <Text>
              <Highlight query={searchTerm} styles={{ bg: 'red.100' }}>
                {extractTranslation(row.labelTranslations, projectLanguage)}
              </Highlight>
            </Text>
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
                projectLanguage
              )}
            </Tag>
          ))}
        </Td>
        <Td>
          {/* TODO : insert correct instanceableType */}
          <DiagramButton
            href={`/projects/${projectId}/diagram/decision-tree/${row.id}`}
            label={t('openMedicalConditions')}
            isDisabled={true}
          />
        </Td>
        <Td>
          {isAdminOrClinician && (
            <MenuCell
              itemId={row.id}
              onDestroy={onDestroy}
              canDestroy={!row.hasInstances}
              onEdit={handleEditQuestionsSequence}
              canEdit={!row.hasInstances}
            />
          )}
        </Td>
      </Tr>
    ),
    [t]
  )

  useEffect(() => {
    if (isDestroySuccess) {
      newToast({
        message: t('notifications.destroySuccess', { ns: 'common' }),
        status: 'success',
      })
    }
  }, [isDestroySuccess])

  useEffect(() => {
    if (isDestroyError) {
      newToast({
        message: t('notifications.destroyError', { ns: 'common' }),
        status: 'error',
      })
    }
  }, [isDestroyError])

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
            {t('new')}
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

MedicalConditions.getLayout = function getLayout(page: ReactElement) {
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
      }

      return {
        redirect: {
          destination: '/500',
          permanent: false,
        },
      }
    }
)
