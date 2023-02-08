/**
 * The external imports
 */
import { useState, useContext, useCallback } from 'react'
import {
  Table,
  Tr,
  Td,
  Button,
  Skeleton,
  Tbody,
  Highlight,
} from '@chakra-ui/react'
import { useTranslation } from 'next-i18next'
import { useRouter } from 'next/router'

/**
 * The internal imports
 */
import { ModalContext, AlertDialogContext } from '/lib/contexts'
import { MenuCell, DiagnosisDetail } from '/components'
import { BackIcon } from '/assets/icons'
import { useLazyGetDiagnosesQuery } from '/lib/services/modules/diagnosis'
import { useDestroyDecisionTreeMutation } from '/lib/services/modules/decisionTree'

const DecisionTreeRow = ({ row, language, searchTerm }) => {
  const { t } = useTranslation('datatable')
  const [isOpen, setIsOpen] = useState(false)
  const router = useRouter()
  const { openModal } = useContext(ModalContext)
  const { openAlertDialog } = useContext(AlertDialogContext)

  const { algorithmId } = router.query

  const [getDiagnoses, { data: diagnoses, isLoading }] =
    useLazyGetDiagnosesQuery()

  const [destroyDecisionTree] = useDestroyDecisionTreeMutation()

  /**
   * Open or close list of diagnoses and fetch releated diagnoses
   */
  const toggleOpen = () => {
    if (!isOpen) {
      getDiagnoses({ algorithmId, decisionTreeId: row.id })
    }
    setIsOpen(prev => !prev)
  }

  /**
   * Callback to handle the info action in the table menu
   * Get diagnosis
   */
  const onInfo = useCallback(diagnosisId => {
    openModal({
      content: <DiagnosisDetail diagnosisId={diagnosisId} />,
      size: 'xl',
    })
  }, [])

  /**
   * Callback to handle the suppression of a decision tree
   */
  const onDestroy = useCallback(decisionTreeId => {
    openAlertDialog(t('delete'), t('areYouSure', { ns: 'common' }), () =>
      destroyDecisionTree(decisionTreeId)
    )
  }, [])

  return (
    <>
      <Tr data-cy='datatable_row'>
        <Td>
          <Highlight query={searchTerm} styles={{ bg: 'red.100' }}>
            {row.labelTranslations[language]}
          </Highlight>
        </Td>
        <Td>{row.node.labelTranslations[language]}</Td>
        <Td>
          <Button onClick={() => console.log('TODO')}>
            {t('openDecisionTree')}
          </Button>
        </Td>
        <Td textAlign='right'>
          <MenuCell itemId={row.id} onDestroy={onDestroy} />
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
                    <Tr key={`diagnosis-${edge.node.id}`}>
                      <Td borderColor='gray.300'>
                        <Highlight
                          query={searchTerm}
                          styles={{ bg: 'red.100' }}
                        >
                          {edge.node.labelTranslations[language]}
                        </Highlight>
                      </Td>
                      <Td borderColor='gray.300'>
                        <Button onClick={() => console.log('TODO')}>
                          {t('openTreatment')}
                        </Button>
                      </Td>
                      <Td textAlign='right' borderColor='gray.300'>
                        <MenuCell itemId={edge.node.id} onInfo={onInfo} />
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
