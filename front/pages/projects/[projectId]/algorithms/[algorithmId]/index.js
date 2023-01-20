/**
 * The external imports
 */
import { useMemo } from 'react'
import { serverSideTranslations } from 'next-i18next/serverSideTranslations'
import { Heading, Button, HStack } from '@chakra-ui/react'
import { useTranslation } from 'next-i18next'

/**
 * The internal imports
 */
import Layout from '/lib/layouts/default'
import { Page } from '/components'
import { wrapper } from '/lib/store'
import { setSession } from '/lib/store/session'
import { getProject } from '/lib/services/modules/project'
import {
  getAlgorithm,
  useGetAlgorithmQuery,
} from '/lib/services/modules/algorithm'
import getUserBySession from '/lib/utils/getUserBySession'
import { apiGraphql } from '/lib/services/apiGraphql'

export default function Algorithm({ algorithmId, currentUser }) {
  const { t } = useTranslation('decisionTrees')
  const { data: algorithm } = useGetAlgorithmQuery(algorithmId)

  /**
   * Calculates whether the current user can perform CRUD actions on algorithms
   */
  const canCrud = useMemo(
    () => ['admin', 'clinician'].includes(currentUser.role),
    []
  )

  return (
    <Page title={algorithm?.name}>
      <HStack justifyContent='space-between' mb={12}>
        <Heading as='h1'>{t('title')}</Heading>
        {canCrud && (
          <Button
            data-cy='create_decision_trees'
            onClick={() => console.log('TODO')}
            variant='outline'
          >
            {t('create')}
          </Button>
        )}
      </HStack>
    </Page>
  )
}

Algorithm.getLayout = function getLayout(page) {
  return <Layout menuType='algorithm'> {page}</Layout>
}

export const getServerSideProps = wrapper.getServerSideProps(
  store =>
    async ({ locale, req, res, query }) => {
      const { projectId, algorithmId } = query
      // Gotta do this everywhere where we have a sidebar
      // ************************************************
      const currentUser = getUserBySession(req, res)
      await store.dispatch(setSession(currentUser))
      store.dispatch(getProject.initiate(projectId))
      store.dispatch(getAlgorithm.initiate(algorithmId))
      await Promise.all(
        store.dispatch(apiGraphql.util.getRunningQueriesThunk())
      )
      // ************************************************

      // Translations
      const translations = await serverSideTranslations(locale, [
        'common',
        'datatable',
        'submenu',
        'algorithms',
        'decisionTrees',
      ])

      return {
        props: {
          algorithmId,
          locale,
          currentUser,
          ...translations,
        },
      }
    }
)
