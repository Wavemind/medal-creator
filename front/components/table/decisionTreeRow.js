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
  Text,
} from '@chakra-ui/react'
import { useTranslation } from 'next-i18next'
import { useRouter } from 'next/router'

/**
 * The internal imports
 */
import { ModalContext } from '/lib/contexts'
import {
  MenuCell,
  DiagnosisDetail,
  DecisionTreeForm,
  DiagnosisForm,
} from '/components'
import { BackIcon } from '/assets/icons'
import { useLazyGetDiagnosesQuery } from '/lib/services/modules/diagnosis'

const DecisionTreeRow = ({ row, language, searchTerm }) => {
  const { t } = useTranslation('datatable')
  const [isOpen, setIsOpen] = useState(false)
  const router = useRouter()
  const { openModal } = useContext(ModalContext)

  const { algorithmId, projectId } = router.query

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

  /**
   * Callback to handle the edit action in the table menu for a decision tree
   */
  const onEditDecisionTree = useCallback(decisionTreeId => {
    openModal({
      title: t('edit', { ns: 'decisionTrees' }),
      content: (
        <DecisionTreeForm
          decisionTreeId={decisionTreeId}
          projectId={projectId}
          algorithmId={algorithmId}
        />
      ),
    })
  }, [])

  /**
   * Callback to handle the new form action in the table menu for a new diagnosis
   */
  const onNewDiagnosis = useCallback(decisionTreeId => {
    openModal({
      title: t('new', { ns: 'diagnoses' }),
      content: (
        <DiagnosisForm decisionTreeId={decisionTreeId} projectId={projectId} />
      ),
    })
  }, [])

  /**
   * Callback to handle the new form action in the table menu for a new diagnosis
   */
  const onEditDiagnosis = useCallback(diagnosisId => {
    openModal({
      title: t('edit', { ns: 'diagnoses' }),
      content: (
        <DiagnosisForm diagnosisId={diagnosisId} projectId={projectId} />
      ),
    })
  }, [])

  /**
   * Callback to handle the info action in the table menu
   */
  const onInfo = useCallback(diagnosisId => {
    openModal({
      content: <DiagnosisDetail diagnosisId={diagnosisId} />,
    })
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
          <MenuCell
            itemId={row.id}
            onEdit={onEditDecisionTree}
            onNew={onNewDiagnosis}
          />
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
                  {diagnoses.edges.length === 0 && (
                    <Tr>
                      <Td colSpan={3}>
                        <Text fontWeight='normal'>{t('noData')}</Text>
                      </Td>
                    </Tr>
                  )}
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
                        <MenuCell
                          itemId={edge.node.id}
                          onInfo={onInfo}
                          onEdit={onEditDiagnosis}
                        />
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
