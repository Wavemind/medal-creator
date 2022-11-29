/**
 * The external imports
 */
import { useMemo } from 'react'
import { serverSideTranslations } from 'next-i18next/serverSideTranslations'
import { VStack, Heading, HStack, Text } from '@chakra-ui/react'
import { useTranslation } from 'next-i18next'
import { captureException } from '@sentry/browser'

/**
 * The internal imports
 */
import { Page, OptimizedLink } from '/components'
import { wrapper } from '/lib/store'
import { setSession } from '/lib/store/session'
import AlgorithmsIcon from '/assets/icons/Algorithms.js'
import LibraryIcon from '/assets/icons/Library'
import MedicationIcon from '/assets/icons/Medication'
import ClipboardIcon from '/assets/icons/Clipboard'
import AppointmentIcon from '/assets/icons/Appointment'
import {
  getProject,
  useGetProjectQuery,
  getProjectSummary,
  useGetProjectSummaryQuery,
} from '/lib/services/modules/project'
import { apiGraphql } from '/lib/services/apiGraphql'
import getUserBySession from '/lib/utils/getUserBySession'

const Project = ({ projectId }) => {
  const { t } = useTranslation('projects')
  const { data: project } = useGetProjectQuery(projectId)
  const { data: projectSummary } = useGetProjectSummaryQuery(projectId)

  const projectInfo = useMemo(
    () => [
      {
        icon: () => <AlgorithmsIcon boxSize={16} />,
        number: projectSummary.algorithmsCount,
        label: t('algorithms'),
      },
      {
        icon: () => <LibraryIcon boxSize={16} />,
        number: projectSummary.questionsCount,
        label: t('variables'),
      },
      {
        icon: () => <MedicationIcon boxSize={16} />,
        number: projectSummary.drugsCount,
        label: t('drugs'),
      },
      {
        icon: () => <ClipboardIcon boxSize={16} />,
        number: projectSummary.managementsCount,
        label: t('managements'),
      },
      {
        icon: () => <AppointmentIcon boxSize={16} />,
        number: projectSummary.questionsSequencesCount,
        label: t('medicalConditions'),
      },
    ],
    [projectSummary]
  )

  // TODO : Add table for lastActivity once it's clarified
  return (
    <Page title={t('title')}>
      <HStack justifyContent='space-between'>
        <Heading>{t('heading', { name: project.name })}</Heading>
        {project.isCurrentUserAdmin && (
          <OptimizedLink
            data-cy='project_settings'
            variant='outline'
            href={`/projects/${project.id}/edit`}
          >
            {t('projectSettings')}
          </OptimizedLink>
        )}
      </HStack>
      <HStack
        justifyContent='space-between'
        my={12}
        wrap='wrap'
        rowGap={8}
        spacing={0}
      >
        {projectInfo.map(info => (
          <VStack
            key={info.label}
            h={200}
            w={200}
            boxShadow='0px 4px 8px 0px #00000026'
            borderRadius='xl'
            justifyContent='center'
          >
            {info.icon()}
            <Text fontWeight='bold'>{info.number}</Text>
            <Text>{info.label}</Text>
          </VStack>
        ))}
      </HStack>
    </Page>
  )
}

export default Project

export const getServerSideProps = wrapper.getServerSideProps(
  store =>
    async ({ locale, req, res, query }) => {
      const { projectId } = query
      const currentUser = getUserBySession(req, res)
      await store.dispatch(setSession(currentUser))
      store.dispatch(getProjectSummary.initiate(projectId))
      const projectResponse = await store.dispatch(
        getProject.initiate(projectId)
      )
      await Promise.all(
        store.dispatch(apiGraphql.util.getRunningQueriesThunk())
      )

      if (projectResponse.isError) {
        captureException(projectResponse)
        return {
          redirect: {
            destination: '/',
            permanent: false,
          },
        }
      }

      // Translations
      const translations = await serverSideTranslations(locale, [
        'common',
        'datatable',
        'projects',
      ])

      return {
        props: {
          projectId,
          locale,
          ...translations,
        },
      }
    }
)
