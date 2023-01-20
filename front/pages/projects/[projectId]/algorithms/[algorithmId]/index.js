/**
 * The external imports
 */
import { serverSideTranslations } from 'next-i18next/serverSideTranslations'
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

export default function Algorithm({ algorithmId }) {
  const { data: algorithm } = useGetAlgorithmQuery(algorithmId)

  return (
    <Page title={algorithm?.name}>
      <h1>Coucou</h1>
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
      ])

      return {
        props: {
          algorithmId,
          locale,
          ...translations,
        },
      }
    }
)
