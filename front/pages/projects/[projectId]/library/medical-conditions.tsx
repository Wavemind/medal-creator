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
import Page from '@/components/page'
import { wrapper } from '@/lib/store'
import Layout from '@/lib/layouts/default'
import { useLazyGetQuestionsSequencesQuery } from '@/lib/api/modules/enhanced/questionSequences.enhanced'
import { useModal, useProject, useAppRouter } from '@/lib/hooks'
import QuestionSequencesForm from '@/components/forms/questionsSequence'
import MedicalConditionRow from '@/components/table/medicalConditionRow'
import type { RenderItemFn, QuestionsSequence } from '@/types'

export default function MedicalConditions() {
  const { t } = useTranslation('questionsSequence')
  const { open: openModal } = useModal()
  const { isAdminOrClinician } = useProject()
  const {
    query: { projectId },
  } = useAppRouter()

  const handleOpenForm = () => {
    openModal({
      title: t('new'),
      content: <QuestionSequencesForm />,
    })
  }

  const medicalConditionsRow = useCallback<RenderItemFn<QuestionsSequence>>(
    (row, searchTerm) => (
      <MedicalConditionRow row={row} searchTerm={searchTerm} />
    ),
    [t]
  )

  return (
    <Page title={t('title')}>
      <HStack justifyContent='space-between' mb={12}>
        <Heading as='h1'>{t('heading')}</Heading>
        {isAdminOrClinician && (
          <Button
            data-testid='create-medical-condition'
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
    async ({ locale }: GetServerSidePropsContext) => {
      if (typeof locale === 'string') {
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
