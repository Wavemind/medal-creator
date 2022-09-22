/**
 * The external imports
 */
import React, { useEffect, useMemo } from 'react'
import {
  Heading,
  Stack,
  useColorMode,
  Button,
  Select,
  HStack,
} from '@chakra-ui/react'
import { useTranslation } from 'next-i18next'
import { serverSideTranslations } from 'next-i18next/serverSideTranslations'
import { useRouter } from 'next/router'
import { useDispatch } from 'react-redux'

/**
 * The internal imports
 */
import { DataTable } from '/components'
import { setName } from '/lib/store/user'

export default function Home() {
  const { toggleColorMode } = useColorMode()
  const { t } = useTranslation('common')
  const router = useRouter()
  const dispatch = useDispatch()

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
   * Changes the selected language
   * @param {*} e event object
   */
  const handleLanguageSelect = e => {
    const { pathname, asPath, query } = router
    router.push({ pathname, query }, asPath, {
      locale: e.target.value.toLowerCase(),
    })
  }

  useEffect(() => {
    dispatch(setName('Sinan'))
  }, [])

  /**
   * Handles the button click in the table
   * @param {*} info
   */
  const handleButtonClick = info => {
    console.log(info)
  }

  return (
    <Stack>
      <Heading variant="h1">{t('welcome')}</Heading>
      <HStack spacing={100}>
        <Button size="sm" colorScheme="blue" onClick={toggleColorMode}>
          Toggle Mode
        </Button>
        <Select
          placeholder="Select language"
          onChange={handleLanguageSelect}
          defaultValue={router.locale}
        >
          <option value="en">English</option>
          <option value="fr">Français</option>
        </Select>
      </HStack>

      <DataTable
        source="diagnosis"
        data={tableData}
        expandable
        hasButton
        sortable
        buttonLabel="Open decision tree"
        onButtonClick={handleButtonClick}
      />
    </Stack>
  )
}

// Also works with getStaticProps
export const getServerSideProps = async ({ locale }) => ({
  props: {
    ...(await serverSideTranslations(locale, ['common', 'datatable'])),
  },
})
