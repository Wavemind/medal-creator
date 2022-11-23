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
import { Page, OptimizedLink, DataTable } from '/components'
import { wrapper } from '/lib/store'
import { setSession } from '/lib/store/session'
import AlgorithmsIcon from '/assets/icons/Algorithms.js'
import LibraryIcon from '/assets/icons/Library'
import MedicationIcon from '/assets/icons/Medication'
import ClipboardIcon from '/assets/icons/Clipboard'
import AppointmentIcon from '/assets/icons/Appointment'
import { getProject, useGetProjectQuery } from '/lib/services/modules/project'
import { apiGraphql } from '/lib/services/apiGraphql'
import getUserBySession from '/lib/utils/getUserBySession'

const Project = ({ id, locale }) => {
  const { t } = useTranslation('projects')
  const { data: project } = useGetProjectQuery(id)

  const projectInfo = useMemo(
    () => [
      {
        icon: () => <AlgorithmsIcon boxSize={16} />,
        number: project.algorithmsCount,
        label: t('algorithms'),
      },
      {
        icon: () => <LibraryIcon boxSize={16} />,
        number: project.questionsCount,
        label: t('variables'),
      },
      {
        icon: () => <MedicationIcon boxSize={16} />,
        number: project.drugsCount,
        label: t('drugs'),
      },
      {
        icon: () => <ClipboardIcon boxSize={16} />,
        number: project.managementsCount,
        label: t('managements'),
      },
      {
        icon: () => <AppointmentIcon boxSize={16} />,
        number: project.questionsSequencesCount,
        label: t('medicalConditions'),
      },
    ],
    [project]
  )

  const tableData = useMemo(
    () =>
      project.lastUpdatedDecisionTrees.map(decisionTree => ({
        name: decisionTree.labelTranslations[locale],
        algorithm: decisionTree.algorithm.name,
        complaintCategory: decisionTree.node.labelTranslations[locale],
        lastOpened: decisionTree.updatedAt,
      })),
    [project.lastUpdatedDecisionTrees]
  )

  /**
   * Handles the button click in the table
   * @param {*} info
   */
  const handleButtonClick = info => {
    console.log(info)
  }

  return (
    <Page title={t('title')}>
      <HStack justifyContent='space-between'>
        <Heading>{t('heading', { name: project.name })}</Heading>
        <OptimizedLink data-cy='project_settings' variant='outline' href='#'>
          {t('projectSettings')}
        </OptimizedLink>
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

      <DataTable
        source='lastActivity'
        data={tableData}
        hasButton
        hasMenu={false}
        buttonLabel={t('openDecisionTree')}
        onButtonClick={handleButtonClick}
        title={t('lastActivity')}
      />
    </Page>
  )
}

export default Project

export const getServerSideProps = wrapper.getServerSideProps(
  store =>
    async ({ locale, req, res, query }) => {
      const { id } = query
      const currentUser = getUserBySession(req, res)
      await store.dispatch(setSession(currentUser))
      const projectResponse = await store.dispatch(getProject.initiate(id))
      await Promise.all(
        store.dispatch(apiGraphql.util.getRunningQueriesThunk())
      )

      if (projectResponse.isError) {
        captureException(projectResponse)
        return {
          redirect: {
            destination: `/?error=${JSON.stringify(projectResponse.error)}`,
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
          id,
          locale,
          ...translations,
        },
      }
    }
)
