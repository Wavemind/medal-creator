/**
 * The external imports
 */
import { useCallback, useMemo } from 'react'
import { serverSideTranslations } from 'next-i18next/serverSideTranslations'
import { VStack, Heading, HStack, Text, Tr, Td } from '@chakra-ui/react'
import { useTranslation } from 'next-i18next'
import { Link } from '@chakra-ui/next-js'
import type { GetServerSidePropsContext } from 'next'

/**
 * The internal imports
 */
import Page from '@/components/page'
import DataTable from '@/components/table/datatable'
import DiagramButton from '@/components/diagramButton'
import { wrapper } from '@/lib/store'
import AlgorithmsIcon from '@/assets/icons/Algorithms'
import LibraryIcon from '@/assets/icons/Library'
import MedicationIcon from '@/assets/icons/Medication'
import ClipboardIcon from '@/assets/icons/Clipboard'
import AppointmentIcon from '@/assets/icons/Appointment'
import {
  getProject,
  getProjectSummary,
  useGetProjectSummaryQuery,
  useLazyGetLastUpdatedDecisionTreesQuery,
} from '@/lib/api/modules/enhanced/project.enhanced'
import { extractTranslation } from '@/lib/utils/string'
import { formatDate } from '@/lib/utils/date'
import { useAppRouter } from '@/lib/hooks/useAppRouter'
import { useProject } from '@/lib/hooks/useProject'
import type { Project, DecisionTree } from '@/types'

export default function Project() {
  const { t } = useTranslation('projects')
  const { projectLanguage, name, isCurrentUserAdmin } = useProject()
  const {
    query: { projectId },
  } = useAppRouter()

  const { data: projectSummary } = useGetProjectSummaryQuery({ id: projectId })

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
        href: `/projects/${projectId}/library`,
      },
      {
        icon: () => <MedicationIcon boxSize={16} />,
        number: projectSummary?.drugsCount,
        label: t('drugs'),
        href: `/projects/${projectId}/library/drugs`,
      },
      {
        icon: () => <ClipboardIcon boxSize={16} />,
        number: projectSummary?.managementsCount,
        label: t('managements'),
        href: `/projects/${projectId}/library/managements`,
      },
      {
        icon: () => <AppointmentIcon boxSize={16} />,
        number: projectSummary?.questionsSequencesCount,
        label: t('medicalConditions'),
        href: `/projects/${projectId}/library/medical-conditions`,
      },
    ],
    [projectSummary, t]
  )

  /**
   * Row definition for lastActivities datatable
   */
  const lastActivityRow = useCallback(
    (row: DecisionTree) => {
      return (
        <Tr data-testid='datatable-row'>
          <Td>
            <Text fontSize='sm' fontWeight='light'>
              {row.fullReference}
            </Text>
            {extractTranslation(row.labelTranslations, projectLanguage)}
          </Td>
          <Td>{row.algorithm.name}</Td>
          <Td>
            {extractTranslation(row.node.labelTranslations, projectLanguage)}
          </Td>
          <Td>{formatDate(new Date(row.updatedAt))}</Td>
          <Td>
            {/* TODO : insert correct instanceableType */}
            <DiagramButton
              href={`/projects/${projectId}/diagram/decision-tree/${row.id}`}
            >
              {t('openDecisionTree', { ns: 'datatable' })}
            </DiagramButton>
          </Td>
        </Tr>
      )
    },
    [t]
  )

  return (
    <Page title={t('title')}>
      <HStack justifyContent='space-between'>
        <Heading>{t('heading', { name })}</Heading>
        {isCurrentUserAdmin && (
          <Link
            data-testid='project-settings'
            variant='outline'
            href={`/projects/${projectId}/edit`}
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
          <Link href={info.href} key={info.href}>
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

export const getServerSideProps = wrapper.getServerSideProps(
  store =>
    async ({ locale, query }: GetServerSidePropsContext) => {
      const { projectId } = query
      if (typeof locale === 'string' && typeof projectId === 'string') {
        const projectSummaryResponse = await store.dispatch(
          getProjectSummary.initiate({ id: projectId })
        )

        const projectResponse = await store.dispatch(
          getProject.initiate({ id: projectId })
        )

        if (projectResponse.isSuccess && projectSummaryResponse.isSuccess) {
          // Translations
          const translations = await serverSideTranslations(locale, [
            'common',
            'datatable',
            'projects',
          ])

          return {
            props: {
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
