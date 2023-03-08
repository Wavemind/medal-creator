/**
 * The external imports
 */
import React, { useState, useContext, useCallback, FC, useEffect } from 'react'
import {
  Table,
  Tr,
  Td,
  Button,
  Skeleton,
  Tbody,
  Highlight,
  Text,
  Box,
} from '@chakra-ui/react'
import { useTranslation } from 'next-i18next'
import { useRouter } from 'next/router'

/**
 * The internal imports
 */
import { ModalContext, AlertDialogContext } from '@/lib/contexts'
import {
  MenuCell,
  DiagnosisDetail,
  DecisionTreeForm,
  DiagnosisForm,
} from '@/components'
import { BackIcon } from '@/assets/icons'
import {
  useDestroyDiagnosisMutation,
  useLazyGetDiagnosesQuery,
  useDestroyDecisionTreeMutation,
} from '@/lib/services/modules'
import { useToast } from '@/lib/hooks'
import { LEVEL_OF_URGENCY_GRADIENT } from '@/lib/config/constants'
import type { DecisionTree } from '@/types'

/**
 * Type definitions
 */
type DecisionTreeProps = {
  row: DecisionTree
  language: string
  searchTerm: string
}

const DecisionTreeRow: FC<DecisionTreeProps> = ({
  row,
  language,
  searchTerm,
}) => {
  const { t } = useTranslation('datatable')
  const [isOpen, setIsOpen] = useState(false)
  const router = useRouter()
  const { newToast } = useToast()

  const { openModal } = useContext(ModalContext)
  const { openAlertDialog } = useContext(AlertDialogContext)

  const { algorithmId, projectId } = router.query

  const [getDiagnoses, { data: diagnoses, isLoading }] =
    useLazyGetDiagnosesQuery()

  const [
    destroyDecisionTree,
    {
      isSuccess: isDecisionTreeDestroySuccess,
      isError: isDecisionTreeDestroyError,
    },
  ] = useDestroyDecisionTreeMutation()
  const [
    destroyDiagnosis,
    { isSuccess: isDiagnosisDestroySuccess, isError: isDiagnosisDestroyError },
  ] = useDestroyDiagnosisMutation()

  /**
   * Open or close list of diagnoses and fetch releated diagnoses
   */
  const toggleOpen = () => {
    if (!isOpen) {
      getDiagnoses({ algorithmId: Number(algorithmId), decisionTreeId: row.id })
    }
    setIsOpen(prev => !prev)
  }

  /**
   * Callback to handle the edit action in the table menu for a decision tree
   */
  const onEditDecisionTree = useCallback((decisionTreeId: number) => {
    openModal({
      title: t('edit', { ns: 'decisionTrees' }),
      content: (
        <DecisionTreeForm
          decisionTreeId={decisionTreeId}
          projectId={Number(projectId)}
          algorithmId={Number(algorithmId)}
        />
      ),
    })
  }, [])

  /**
   * Callback to handle the new form action in the table menu for a new diagnosis
   */
  const onNewDiagnosis = useCallback((decisionTreeId: number) => {
    openModal({
      title: t('new', { ns: 'diagnoses' }),
      content: (
        <DiagnosisForm
          decisionTreeId={decisionTreeId}
          projectId={Number(projectId)}
        />
      ),
    })
  }, [])

  /**
   * Callback to handle the new form action in the table menu for a new diagnosis
   */
  const onEditDiagnosis = useCallback((diagnosisId: number) => {
    openModal({
      title: t('edit', { ns: 'diagnoses' }),
      content: (
        <DiagnosisForm
          diagnosisId={diagnosisId}
          projectId={Number(projectId)}
        />
      ),
    })
  }, [])

  /**
   * Callback to handle the suppression of a decision tree
   */
  const onDestroy = useCallback((decisionTreeId: number) => {
    openAlertDialog({
      title: t('delete'),
      content: t('areYouSure', { ns: 'common' }),
      action: () => destroyDecisionTree(Number(decisionTreeId)),
    })
  }, [])

  /**
   * Callback to handle the suppression of a decision tree
   */
  const onDiagnosisDestroy = useCallback((diagnosisId: number) => {
    openAlertDialog({
      title: t('delete'),
      content: t('areYouSure', { ns: 'common' }),
      action: () => destroyDiagnosis(Number(diagnosisId)),
    })
  }, [])

  /**
   * Callback to handle the info action in the table menu
   */
  const onInfo = useCallback((diagnosisId: number) => {
    openModal({
      content: <DiagnosisDetail diagnosisId={diagnosisId} />,
    })
  }, [])

  useEffect(() => {
    if (isDecisionTreeDestroySuccess || isDiagnosisDestroySuccess) {
      newToast({
        message: t('notifications.destroySuccess', { ns: 'common' }),
        status: 'success',
      })
    }
  }, [isDecisionTreeDestroySuccess, isDiagnosisDestroySuccess])

  useEffect(() => {
    if (isDecisionTreeDestroyError || isDiagnosisDestroyError) {
      newToast({
        message: t('notifications.destroyError', { ns: 'common' }),
        status: 'error',
      })
    }
  }, [isDecisionTreeDestroyError, isDiagnosisDestroyError])

  return (
    <React.Fragment>
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
            onDestroy={onDestroy}
          />
          <Button
            data-cy='datatable_open_diagnosis'
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
            <Table data-cy='diagnoses_row'>
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
                  {diagnoses?.edges.length === 0 && (
                    <Tr>
                      <Td colSpan={3}>
                        <Text fontWeight='normal'>{t('noData')}</Text>
                      </Td>
                    </Tr>
                  )}
                  {diagnoses?.edges.map(edge => (
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
                        <Box
                          borderColor='black'
                          borderWidth={2}
                          borderRadius='full'
                          height={8}
                          width={8}
                          display='flex'
                          justifyContent='center'
                          alignItems='center'
                          bg={
                            LEVEL_OF_URGENCY_GRADIENT[
                              edge.node.levelOfUrgency - 1
                            ]
                          }
                        >
                          {edge.node.levelOfUrgency}
                        </Box>
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
                          onDestroy={onDiagnosisDestroy}
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
    </React.Fragment>
  )
}

export default DecisionTreeRow
