/**
 * The external imports
 */
// import { useCallback, useContext, useEffect, useMemo } from 'react'
// import { Heading, Button, HStack } from '@chakra-ui/react'
// import { serverSideTranslations } from 'next-i18next/serverSideTranslations'
import { useTranslation } from 'next-i18next'

/**
 * The internal imports
 */
// import { ModalContext, AlertDialogContext } from '/lib/contexts'
import { AlgorithmForm, Page, DataTable } from '/components'
// import { wrapper } from '/lib/store'
// import { setSession } from '/lib/store/session'
// import {
//   useLazyGetAlgorithmsQuery,
//   useDestroyAlgorithmMutation,
// } from '/lib/services/modules/algorithm'
// import { getProject } from '/lib/services/modules/project'
// import getUserBySession from '/lib/utils/getUserBySession'
// import { apiGraphql } from '/lib/services/apiGraphql'
// import { getLanguages } from '/lib/services/modules/language'
// import { useToast } from '/lib/hooks'

export default function Algorithms({ projectId, currentUser }) {
  const { t } = useTranslation('algorithms')

  return (
    <Page title={t('title')}>
      <h1>Coucou</h1>
      {/* <HStack justifyContent='space-between'>
        <Heading as='h1'>{t('heading')}</Heading>
        {canCrud && (
          <Button data-cy='create_algorithm' onClick={handleOpenForm}>
            {t('create')}
          </Button>
        )}
      </HStack>

      <DataTable
        source='algorithms'
        hasButton
        searchable
        searchPlaceholder={t('searchPlaceholder')}
        buttonLabelKey='openDecisionTree'
        onButtonClick={handleButtonClick}
        apiQuery={useLazyGetAlgorithmsQuery}
        requestParams={{ projectId }}
        editable={canCrud}
        handleEditClick={onEditClick}
        destroyable={canCrud}
        handleDestroyClick={onDestroyClick}
      /> */}
    </Page>
  )
}

// export const getServerSideProps = wrapper.getServerSideProps(
//   store =>
//     async ({ locale, req, res, query }) => {
//       const { projectId } = query
//       // Gotta do this everywhere where we have a sidebar
//       // ************************************************
//       const currentUser = getUserBySession(req, res)
//       await store.dispatch(setSession(currentUser))
//       store.dispatch(getProject.initiate(projectId))
//       await Promise.all(
//         store.dispatch(apiGraphql.util.getRunningQueriesThunk())
//       )
//       // ************************************************
//       await store.dispatch(getLanguages.initiate())

//       // Translations
//       const translations = await serverSideTranslations(locale, [
//         'common',
//         'datatable',
//         'projects',
//         'algorithms',
//       ])

//       return {
//         props: {
//           projectId,
//           locale,
//           currentUser,
//           ...translations,
//         },
//       }
//     }
// )
