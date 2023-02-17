/**
 * The external imports
 */
import { FC, useCallback, useMemo } from 'react'
import { serverSideTranslations } from 'next-i18next/serverSideTranslations'
import { VStack, Heading, HStack, Text, Button, Tr, Td } from '@chakra-ui/react'
import { useTranslation } from 'next-i18next'
import { captureException } from '@sentry/browser'
import {
  GetServerSidePropsContext,
  NextApiRequest,
  NextApiResponse,
} from 'next'

/**
 * The internal imports
 */
import { Page, OptimizedLink, DataTable } from '@/components'
import { wrapper } from '@/lib/store'
import { setSession } from '@/lib/store/session'
import AlgorithmsIcon from '@/assets/icons/Algorithms.js'
import LibraryIcon from '@/assets/icons/Library'
import MedicationIcon from '@/assets/icons/Medication'
import ClipboardIcon from '@/assets/icons/Clipboard'
import AppointmentIcon from '@/assets/icons/Appointment'
import {
  getProject,
  useGetProjectQuery,
  getProjectSummary,
  useGetProjectSummaryQuery,
  useLazyGetLastUpdatedDecisionTreesQuery,
} from '@/lib/services/modules/project'
import { apiGraphql } from '@/lib/services/apiGraphql'
import getUserBySession from '@/lib/utils/getUserBySession'
import { formatDate } from '@/lib/utils/date'
import type { Project, ProjectSummary } from '@/types/project'
import type { DecisionTree } from '@/types/decisionTree'

/**
 * Type definitions
 */
type ProjectProps = {
  projectId: string
}

const Project: FC<ProjectProps> = ({ projectId }) => {
  const { t } = useTranslation('projects')
  const { data: project = {} as Project } = useGetProjectQuery(projectId)
  const { data: projectSummary = {} as ProjectSummary } =
    useGetProjectSummaryQuery(projectId)

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

  /**
   * Handles the button click in the table
   * @param {*} info
   */
  // TODO : Fix the unknown once we know what we get here
  const handleButtonClick = (info: unknown) => {
    console.log(info)
  }

  /**
   * Row definition for lastActivities datatable
   */
  const lastActivityRow = useCallback(
    (row: DecisionTree) => (
      <Tr data-cy='datatable_row'>
        <Td>{row.labelTranslations[project.language.code]}</Td>
        <Td>{row.algorithm.name}</Td>
        <Td>{row.node.labelTranslations[project.language.code]}</Td>
        <Td>{formatDate(new Date(row.updatedAt))}</Td>
        <Td>
          <Button onClick={handleButtonClick}>
            {t('openDecisionTree', { ns: 'datatable' })}
          </Button>
        </Td>
      </Tr>
    ),
    []
  )

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
      <Heading>TODO {t('lastActivity')}</Heading>
      <DataTable
        source='lastActivities'
        apiQuery={useLazyGetLastUpdatedDecisionTreesQuery}
        requestParams={{ projectId }}
        renderItem={lastActivityRow}
        perPage={5}
        paginable={false}
      />
    </Page>
  )
}

export default Project

export const getServerSideProps = wrapper.getServerSideProps(
  store =>
    async ({ locale, req, res, query }: GetServerSidePropsContext) => {
      const { projectId } = query
      if (typeof projectId === 'string') {
        const currentUser = getUserBySession(
          req as NextApiRequest,
          res as NextApiResponse
        )
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
        const translations = await serverSideTranslations(locale as string, [
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
      return {
        redirect: {
          destination: '/',
          permanent: false,
        },
      }
    }
)
