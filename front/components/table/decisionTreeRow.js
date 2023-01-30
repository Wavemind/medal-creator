/**
 * The external imports
 */
import { useState } from 'react'
import { Table, Tr, Td, Button, Tbody, Text } from '@chakra-ui/react'
import { useTranslation } from 'next-i18next'

/**
 * The internal imports
 */
import { MenuCell } from '/components'
import { BackIcon } from '/assets/icons'

const DecisionTreeRow = ({ row, language }) => {
  const { t } = useTranslation('datatable')
  const [isOpen, setIsOpen] = useState(false)

  /**
   * Open or close list of diagnoses
   */
  const toggleOpen = () => {
    setIsOpen(prev => !prev)
  }

  return (
    <>
      <Tr data-cy='datatable_row'>
        <Td>{row.labelTranslations[language]}</Td>
        <Td>{row.node.labelTranslations[language]}</Td>
        <Td>
          <Button>{t('openDecisionTree')}</Button>
        </Td>
        <Td textAlign='right'>
          <MenuCell itemId={row.id} />
          <Button
            onClick={toggleOpen}
            variant='link'
            fontSize='xs'
            fontWeight='medium'
            color='primary'
            rightIcon={
              <BackIcon
                sx={{ transform: isOpen ? 'rotate(90deg)' : 'rotate(-90deg)' }}
              />
            }
          >
            {t('showDiagnoses')}
          </Button>
        </Td>
      </Tr>
      {isOpen && (
        <Tr>
          <Td p={0} colSpan={4} pl={24} bg='gray.100'>
            <Table>
              <Tbody>
                <Tr>
                  <Td>
                    Severe penumonia Severe penumonia Severe penumonia Severe
                  </Td>
                  <Td>CC21 - General</Td>
                  <Td>
                    <Button>{t('openTreatment')}</Button>
                  </Td>
                  <Td textAlign='right'>
                    <MenuCell itemId={row.id} />
                  </Td>
                </Tr>
                <Tr>
                  <Td>Severe penumonia</Td>
                  <Td>CC21 - General</Td>
                  <Td>
                    <Button>{t('openTreatment')}</Button>
                  </Td>
                  <Td textAlign='right'>
                    <MenuCell itemId={row.id} />
                  </Td>
                </Tr>
                <Tr>
                  <Td>Severe penumonia</Td>
                  <Td>CC21 - General</Td>
                  <Td>
                    <Button>{t('openTreatment')}</Button>
                  </Td>
                  <Td textAlign='right'>
                    <MenuCell itemId={row.id} />
                  </Td>
                </Tr>
              </Tbody>
            </Table>
          </Td>
        </Tr>
      )}
    </>
  )
}

export default DecisionTreeRow
