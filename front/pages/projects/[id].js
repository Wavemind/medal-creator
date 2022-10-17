/**
 * The external imports
 */
import { useMemo } from 'react'
import { serverSideTranslations } from 'next-i18next/serverSideTranslations'
import { getCookie } from 'cookies-next'
import { VStack, Heading, HStack, Text } from '@chakra-ui/react'
import { useTranslation } from 'next-i18next'

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
import {
  getProject,
  useGetProjectQuery,
  getRunningOperationPromises,
} from '/lib/services/modules/project'

const Project = ({ id, locale }) => {
  const { t } = useTranslation('projects')
  const { data } = useGetProjectQuery(id)

  const projectInfo = useMemo(
    () => [
      {
        icon: () => <AlgorithmsIcon boxSize={16} />,
        number: data.algorithmsCount,
        label: t('algorithms'),
      },
      {
        icon: () => <LibraryIcon boxSize={16} />,
        number: data.questionsCount,
        label: t('variables'),
      },
      {
        icon: () => <MedicationIcon boxSize={16} />,
        number: data.drugsCount,
        label: t('drugs'),
      },
      {
        icon: () => <ClipboardIcon boxSize={16} />,
        number: data.managementsCount,
        label: t('managements'),
      },
      {
        icon: () => <AppointmentIcon boxSize={16} />,
        number: data.questionsSequencesCount,
        label: t('medicalConditions'),
      },
    ],
    [data]
  )

  const tableData = useMemo(
    () =>
      data.lastUpdatedDecisionTrees.map(decisionTree => ({
        name: decisionTree.labelTranslations[locale],
        algorithm: decisionTree.algorithm.name,
        complaintCategory: decisionTree.node.labelTranslations[locale],
        lastOpened: decisionTree.updatedAt,
      })),
    [data.lastUpdatedDecisionTrees]
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
        <Heading>{t('heading', { name: data.name })}</Heading>
        <OptimizedLink data-cy='project_settings' variant='outline' href='#'>
          {t('projectSettings')}
        </OptimizedLink>
      </HStack>
      <HStack
        justifyContent='space-between'
        mt={12}
        wrap='wrap'
        rowGap={8}
        spacing={0}
      >
        {projectInfo.map(info => (
          <VStack
            key={info.label}
            h={250}
            w={250}
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
      await store.dispatch(
        setSession(JSON.parse(getCookie('session', { req, res })))
      )
      store.dispatch(getProject.initiate(id))
      await Promise.all(getRunningOperationPromises())

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
