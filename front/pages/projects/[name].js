/**
 * The external imports
 */
import { useMemo } from 'react'
import { serverSideTranslations } from 'next-i18next/serverSideTranslations'
import { getCookie } from 'cookies-next'
import { VStack, Heading, HStack, Text } from '@chakra-ui/react'

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
  getUser,
  getRunningOperationPromises,
} from '/lib/services/modules/user'

const Project = () => {
  // Get this from db
  const projectInfo = useMemo(
    () => [
      {
        icon: () => <AlgorithmsIcon boxSize={16} />,
        number: 4,
        label: 'Algorithms',
      },
      {
        icon: () => <LibraryIcon boxSize={16} />,
        number: 564,
        label: 'Variables',
      },
      {
        icon: () => <MedicationIcon boxSize={16} />,
        number: 456,
        label: 'Drugs',
      },
      {
        icon: () => <ClipboardIcon boxSize={16} />,
        number: 123,
        label: 'Managements',
      },
      {
        icon: () => <AppointmentIcon boxSize={16} />,
        number: 80,
        label: 'MedicalConditions',
      },
    ],
    []
  )

  // TODO Get table data dynamically
  const tableData = useMemo(
    () => [
      {
        name: 'Pneumonia',
        complaintCategory: 'CC21 - General',
        subRows: [
          { name: 'Severe Pneumonia', complaintCategory: 'CC21 - General' },
          { name: 'Bacterial pneumonia', complaintCategory: 'CC21 - General' },
          { name: 'Viral pneumonia', complaintCategory: 'CC21 - General' },
        ],
      },
      {
        name: 'Deep wound',
        complaintCategory: 'CC27 - Ear, Nose, Throat',
      },
      {
        name: 'Low weight',
        complaintCategory: 'CC23 - Cerebral',
      },
    ],
    []
  )

  /**
   * Handles the button click in the table
   * @param {*} info
   */
  const handleButtonClick = info => {
    console.log(info)
  }

  return (
    <Page title='Project'>
      <HStack justifyContent='space-between'>
        <Heading>Project : Dynamic Tanzania</Heading>
        <OptimizedLink variant='outline' href='#'>
          Project settings
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
        source='diagnosis'
        data={tableData}
        hasButton
        buttonLabel='Open decision tree'
        onButtonClick={handleButtonClick}
        title='Last activity'
      />
    </Page>
  )
}

export default Project

export const getServerSideProps = wrapper.getServerSideProps(
  store =>
    async ({ locale, req, res }) => {
      const userId = await JSON.parse(getCookie('session', { req, res })).userId
      await store.dispatch(
        setSession(JSON.parse(getCookie('session', { req, res })))
      )
      store.dispatch(getUser.initiate(userId))
      await Promise.all(getRunningOperationPromises())

      // Translations
      const translations = await serverSideTranslations(locale, [
        'common',
        'account',
        'submenu',
        'validations',
        'datatable',
      ])

      return {
        props: {
          ...translations,
          userId,
        },
      }
    }
)
