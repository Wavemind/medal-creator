/**
 * The external imports
 */
import React, { useCallback, useEffect } from 'react'
import { useTranslation } from 'next-i18next'
import { Td, Highlight, Text, Tr, Button } from '@chakra-ui/react'

/**
 * The internal imports
 */
import { useToast } from '@/lib/hooks/useToast'
import { useAlertDialog } from '@/lib/hooks/useAlertDialog'
import { useProject } from '@/lib/hooks/useProject'
import { useDestroyNodeExclusionMutation } from '@/lib/api/modules/enhanced/nodeExclusion.enhanced'
import { extractTranslation } from '@/lib/utils/string'
import type { DiagnosisExclusionRowComponent } from '@/types'

const DiagnosisExclusionRow: DiagnosisExclusionRowComponent = ({
  row,
  searchTerm,
}) => {
  const { t } = useTranslation('datatable')
  const { newToast } = useToast()
  const { open: openAlertDialog } = useAlertDialog()
  const { isAdminOrClinician, projectLanguage } = useProject()

  const [
    destroyNodeExclusion,
    {
      isSuccess: isDestroyDrugExclusionSuccess,
      isError: isDestroyDrugExclusionError,
    },
  ] = useDestroyNodeExclusionMutation()

  /**
   * Callback to handle the suppression of a node exclusion
   */
  const onDestroyNodeExclusion = useCallback((): void => {
    openAlertDialog({
      title: t('delete'),
      content: t('areYouSure', { ns: 'common' }),
      action: () =>
        destroyNodeExclusion({
          excludingNodeId: row.excludingNode.id,
          excludedNodeId: row.excludedNode.id,
        }),
    })
  }, [t, row])

  useEffect(() => {
    if (isDestroyDrugExclusionSuccess) {
      newToast({
        message: t('notifications.destroySuccess', { ns: 'common' }),
        status: 'success',
      })
    }
  }, [isDestroyDrugExclusionSuccess])

  useEffect(() => {
    if (isDestroyDrugExclusionError) {
      newToast({
        message: t('notifications.destroyError', { ns: 'common' }),
        status: 'error',
      })
    }
  }, [isDestroyDrugExclusionError])

  // TODO: Allow edition "menu options" only in draft mode

  return (
    <Tr data-testid='datatable-row'>
      <Td w='45%'>
        <Text fontSize='sm' fontWeight='light'>
          <Highlight query={searchTerm} styles={{ bg: 'red.100' }}>
            {`${row.excludingNode.fullReference} • ${extractTranslation(
              row.excludingNode.labelTranslations,
              projectLanguage
            )}`}
          </Highlight>
        </Text>
      </Td>
      <Td w='45%'>
        <Text fontSize='sm' fontWeight='light'>
          <Highlight query={searchTerm} styles={{ bg: 'red.100' }}>
            {`${row.excludedNode.fullReference} • ${extractTranslation(
              row.excludedNode.labelTranslations,
              projectLanguage
            )}`}
          </Highlight>
        </Text>
      </Td>
      <Td>
        {isAdminOrClinician && (
          <Button
            data-testid='delete-diagnosis-exclusion'
            onClick={onDestroyNodeExclusion}
          >
            {t('delete')}
          </Button>
        )}
      </Td>
    </Tr>
  )
}

export default DiagnosisExclusionRow
