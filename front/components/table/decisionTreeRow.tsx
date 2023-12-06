/**
 * The external imports
 */
import React, { useState, useCallback, useEffect } from 'react'
import { VStack, Tr, Td, Button, Highlight, Text } from '@chakra-ui/react'
import { useTranslation } from 'next-i18next'

/**
 * The internal imports
 */
import MenuCell from '@/components/table/menuCell'
import DecisionTreeForm from '@/components/forms/decisionTree'
import DiagramButton from '@/components/diagramButton'
import DiagramService from '@/lib/services/diagram.service'
import BackIcon from '@/assets/icons/Back'
import DiagnosisRow from '@/components/table/diagnosisRow'
import {
  useDestroyDecisionTreeMutation,
  useDuplicateDecisionTreeMutation,
} from '@/lib/api/modules/enhanced/decisionTree.enhanced'
import { useToast } from '@/lib/hooks/useToast'
import { useModal } from '@/lib/hooks/useModal'
import { useAlertDialog } from '@/lib/hooks/useAlertDialog'
import { useAppRouter } from '@/lib/hooks/useAppRouter'
import { useProject } from '@/lib/hooks/useProject'
import { extractTranslation } from '@/lib/utils/string'
import type { DecisionTreeRowComponent, Scalars } from '@/types'

const DecisionTreeRow: DecisionTreeRowComponent = ({ row, searchTerm }) => {
  const { t } = useTranslation('datatable')
  const [isOpen, setIsOpen] = useState(false)
  const { newToast } = useToast()
  const { isAdminOrClinician, projectLanguage } = useProject()

  const { open: openModal } = useModal()
  const { open: openAlertDialog } = useAlertDialog()

  const {
    query: { algorithmId, projectId },
  } = useAppRouter()

  const [
    destroyDecisionTree,
    {
      isSuccess: isDecisionTreeDestroySuccess,
      isError: isDecisionTreeDestroyError,
    },
  ] = useDestroyDecisionTreeMutation()

  const [
    duplicateDecisionTree,
    {
      isSuccess: isDecisionTreeDuplicateSuccess,
      isError: isDecisionTreeDuplicateError,
    },
  ] = useDuplicateDecisionTreeMutation()

  /**
   * Callback to handle the edit action in the table menu for a decision tree
   */
  const onEditDecisionTree = useCallback((decisionTreeId: Scalars['ID']) => {
    openModal({
      title: t('edit', { ns: 'decisionTrees' }),
      content: (
        <DecisionTreeForm
          decisionTreeId={decisionTreeId}
          algorithmId={algorithmId}
        />
      ),
    })
  }, [])

  /**
   * Callback to handle the suppression of a decision tree
   */
  const onDestroy = useCallback((decisionTreeId: Scalars['ID']) => {
    openAlertDialog({
      title: t('delete'),
      content: t('areYouSure', { ns: 'common' }),
      action: () => destroyDecisionTree({ id: decisionTreeId }),
    })
  }, [])

  /**
   * Callback to handle the duplication of a decision tree
   */
  const onDuplicate = useCallback((decisionTreeId: Scalars['ID']) => {
    openAlertDialog({
      title: t('duplicate'),
      content: t('areYouSure', { ns: 'common' }),
      action: () => duplicateDecisionTree({ id: decisionTreeId }),
    })
  }, [])

  useEffect(() => {
    if (isDecisionTreeDestroySuccess) {
      newToast({
        message: t('notifications.destroySuccess', { ns: 'common' }),
        status: 'success',
      })
    }
  }, [isDecisionTreeDestroySuccess])

  useEffect(() => {
    if (isDecisionTreeDestroyError) {
      newToast({
        message: t('notifications.destroyError', { ns: 'common' }),
        status: 'error',
      })
    }
  }, [isDecisionTreeDestroyError])

  useEffect(() => {
    if (isDecisionTreeDuplicateSuccess) {
      newToast({
        message: t('notifications.duplicateSuccess', { ns: 'common' }),
        status: 'success',
      })
    }
  }, [isDecisionTreeDuplicateSuccess])

  useEffect(() => {
    if (isDecisionTreeDuplicateError) {
      newToast({
        message: t('notifications.duplicateError', { ns: 'common' }),
        status: 'error',
      })
    }
  }, [isDecisionTreeDuplicateError])

  return (
    <React.Fragment>
      <Tr data-testid='datatable-row'>
        <Td>
          <VStack alignItems='left'>
            <Text fontSize='sm' fontWeight='light'>
              {row.fullReference}
            </Text>
            <Text>
              <Highlight query={searchTerm} styles={{ bg: 'red.100' }}>
                {extractTranslation(row.labelTranslations, projectLanguage)}
              </Highlight>
            </Text>
          </VStack>
        </Td>
        <Td>
          {extractTranslation(row.node.labelTranslations, projectLanguage)}
        </Td>
        <Td>
          {row.cutOffStart &&
            row.cutOffEnd &&
            t('cutOffDisplay', {
              ns: 'diagram',
              cutOffStart: DiagramService.readableDate(row.cutOffStart, t),
              cutOffEnd: DiagramService.readableDate(row.cutOffEnd, t),
            })}
        </Td>
        <Td>
          <DiagramButton
            href={`/projects/${projectId}/diagram/decision-tree/${row.id}`}
          >
            {t('openDecisionTree')}
          </DiagramButton>
        </Td>
        <Td textAlign='right'>
          {isAdminOrClinician && (
            <MenuCell
              itemId={row.id}
              onEdit={onEditDecisionTree}
              onDestroy={onDestroy}
              onDuplicate={onDuplicate}
            />
          )}
          <Button
            data-testid='datatable-open-diagnosis'
            onClick={() => setIsOpen(prev => !prev)}
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
        <DiagnosisRow decisionTreeId={row.id} searchTerm={searchTerm} />
      )}
    </React.Fragment>
  )
}

export default DecisionTreeRow
