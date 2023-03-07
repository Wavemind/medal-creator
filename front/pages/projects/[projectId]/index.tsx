/**
 * The external imports
 */
import { FC, useCallback, useMemo } from 'react'
import { serverSideTranslations } from 'next-i18next/serverSideTranslations'
import { VStack, Heading, HStack, Text, Button, Tr, Td } from '@chakra-ui/react'
import { useTranslation } from 'next-i18next'
import { captureException } from '@sentry/browser'
import type { GetServerSidePropsContext } from 'next'

/**
 * The internal imports
 */
import { Page, OptimizedLink, DataTable } from '@/components'
import { wrapper } from '@/lib/store'
import {
  AlgorithmsIcon,
  LibraryIcon,
  MedicationIcon,
  ClipboardIcon,
  AppointmentIcon,
} from '@/assets/icons'
import {
  getProject,
  useGetProjectQuery,
  getProjectSummary,
  useGetProjectSummaryQuery,
  useLazyGetLastUpdatedDecisionTreesQuery,
} from '@/lib/services/modules'
import { apiGraphql } from '@/lib/services/apiGraphql'
import { formatDate } from '@/lib/utils'
import type { Project, ProjectSummary, DecisionTree } from '@/types'

/**
 * Type definitions
 */
type ProjectProps = {
  projectId: number
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
  const handleButtonClick = (info: unknown) => {
    console.log(info)
  }

  /**
   * Row definition for lastActivities datatable
   */
  const lastActivityRow = useCallback(
    (row: DecisionTree) => (
      <Tr data-cy='datatable_row'>
        <Td>{row.labelTranslations[project.language?.code]}</Td>
        <Td>{row.algorithm.name}</Td>
        <Td>{row.node.labelTranslations[project.language?.code]}</Td>
        <Td>{formatDate(new Date(row.updatedAt))}</Td>
        <Td>
          <Button onClick={handleButtonClick}>
            {t('openDecisionTree', { ns: 'datatable' })}
          </Button>
        </Td>
      </Tr>
    ),
    [project]
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
      <Heading as='h2' size='md'>
        {t('lastActivity')}
      </Heading>
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
    async ({ locale, query }: GetServerSidePropsContext) => {
      const { projectId } = query
      if (typeof locale === 'string') {
        store.dispatch(getProjectSummary.initiate(Number(projectId)))
        const projectResponse = await store.dispatch(
          getProject.initiate(Number(projectId))
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
