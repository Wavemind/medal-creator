/**
 * The external imports
 */
import { useCallback, useMemo } from 'react'
import { serverSideTranslations } from 'next-i18next/serverSideTranslations'
import {
  VStack,
  Heading,
  HStack,
  Text,
  Button,
  Tr,
  Td,
  Spinner,
} from '@chakra-ui/react'
import { useTranslation } from 'next-i18next'
import { captureException } from '@sentry/browser'
import { Link } from '@chakra-ui/next-js'
import type { GetServerSidePropsContext } from 'next'

/**
 * The internal imports
 */
import { Page, DataTable } from '@/components'
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
} from '@/lib/api/modules'
import { apiGraphql } from '@/lib/api/apiGraphql'
import { formatDate } from '@/lib/utils'
import type { Project, DecisionTree, ProjectId } from '@/types'

export default function Project({ projectId }: ProjectId) {
  const { t } = useTranslation('projects')
  const { data: project, isSuccess: isProjectSuccess } =
    useGetProjectQuery(projectId)
  const { data: projectSummary } = useGetProjectSummaryQuery(projectId)

  const projectInfo = useMemo(
    () => [
      {
        icon: () => <AlgorithmsIcon boxSize={16} />,
        number: projectSummary?.algorithmsCount,
        label: t('algorithms'),
        href: `/projects/${projectId}/algorithms`,
      },
      {
        icon: () => <LibraryIcon boxSize={16} />,
        number: projectSummary?.variablesCount,
        label: t('variables'),
        href: `/projects/${projectId}/variables`,
      },
      {
        icon: () => <MedicationIcon boxSize={16} />,
        number: projectSummary?.drugsCount,
        label: t('drugs'),
        href: `/projects/${projectId}/drugs`,
      },
      {
        icon: () => <ClipboardIcon boxSize={16} />,
        number: projectSummary?.managementsCount,
        label: t('managements'),
        href: `/projects/${projectId}/managements`,
      },
      {
        icon: () => <AppointmentIcon boxSize={16} />,
        number: projectSummary?.questionsSequencesCount,
        label: t('medicalConditions'),
        href: `/projects/${projectId}/medical-conditions`,
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
        <Td>{row.labelTranslations[project!.language.code]}</Td>
        <Td>{row.algorithm.name}</Td>
        <Td>{row.node.labelTranslations[project!.language.code]}</Td>
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

  if (isProjectSuccess) {
    return (
      <Page title={t('title')}>
        <HStack justifyContent='space-between'>
          <Heading>{t('heading', { name: project.name })}</Heading>
          {project.isCurrentUserAdmin && (
            <Link
              data-cy='project_settings'
              variant='outline'
              href={`/projects/${project.id}/edit`}
            >
              {t('projectSettings')}
            </Link>
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
            <Link href={info.href}>
              <VStack
                key={info.label}
                h={200}
                w={200}
                boxShadow='0px 4px 8px 0px #00000026'
                borderRadius='xl'
                justifyContent='center'
                _hover={{
                  boxShadow: 'xl',
                  transitionDuration: '0.5s',
                  transitionTimingFunction: 'ease-in-out',
                }}
              >
                {info.icon()}
                <Text fontWeight='bold'>{info.number}</Text>
                <Text>{info.label}</Text>
              </VStack>
            </Link>
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

  return <Spinner size='xl' />
}

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
