/**
 * The external imports
 */
import { useState } from 'react'
import { Table, Tr, Td, Button, Skeleton, Tbody } from '@chakra-ui/react'
import { useTranslation } from 'next-i18next'
import { useRouter } from 'next/router'

/**
 * The internal imports
 */
import { MenuCell } from '/components'
import { BackIcon } from '/assets/icons'
import { useLazyGetDiagnosesQuery } from '/lib/services/modules/diagnose'

const DecisionTreeRow = ({ row, language }) => {
  const { t } = useTranslation('datatable')
  const [isOpen, setIsOpen] = useState(false)
  const router = useRouter()

  const { algorithmId } = router.query

  const [getDiagnoses, { data: diagnoses, isLoading }] =
    useLazyGetDiagnosesQuery()

  /**
   * Open or close list of diagnoses and fetch releated diagnoses
   */
  const toggleOpen = () => {
    if (!isOpen) {
      getDiagnoses({ algorithmId, decisionTreeId: row.id })
    }
    setIsOpen(prev => !prev)
  }

  return (
    <>
      <Tr data-cy='datatable_row'>
        <Td>{row.labelTranslations[language]}</Td>
        <Td>{row.node.labelTranslations[language]}</Td>
        <Td>
          <Button onClick={() => console.log('TODO')}>
            {t('openDecisionTree')}
          </Button>
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
              {isLoading ? (
                <Tbody>
                  <Tr>
                    <Td colSpan={3}>
                      <Skeleton h={10} />
                    </Td>
                  </Tr>
                  <Tr>
                    <Td colSpan={3}>
                      <Skeleton h={10} />
                    </Td>
                  </Tr>
                </Tbody>
              ) : (
                <Tbody>
                  {diagnoses.edges.map(edge => (
                    <Tr key={`diagnose-${edge.node.id}`}>
                      <Td>{edge.node.labelTranslations[language]}</Td>
                      <Td>
                        <Button onClick={() => console.log('TODO')}>
                          {t('openTreatment')}
                        </Button>
                      </Td>
                      <Td textAlign='right'>
                        <MenuCell itemId={row.id} />
                      </Td>
                    </Tr>
                  ))}
                </Tbody>
              )}
            </Table>
          </Td>
        </Tr>
      )}
    </>
  )
}

export default DecisionTreeRow