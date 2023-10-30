/**
 * The external imports
 */
import React, { useCallback, useEffect } from 'react'
import { useTranslation } from 'next-i18next'
import { Td, Highlight, Text, Tr, Button } from '@chakra-ui/react'

/**
 * The internal imports
 */
import { useAlertDialog, useToast, useProject } from '@/lib/hooks'
import { useDestroyNodeExclusionMutation } from '@/lib/api/modules/enhanced/nodeExclusion.enhanced'
import type { DiagnosisExclusionRowComponent, Scalars } from '@/types'

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
  const onDestroyNodeExclusion = useCallback(
    (id: Scalars['ID']): void => {
      openAlertDialog({
        title: t('delete'),
        content: t('areYouSure', { ns: 'common' }),
        action: () => destroyNodeExclusion({ id }),
      })
    },
    [t]
  )

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

  return (
    <Tr data-testid='datatable-row'>
      <Td w='45%'>
        <Text fontSize='sm' fontWeight='light'>
          <Highlight query={searchTerm} styles={{ bg: 'red.100' }}>
            {row.excludingNode.labelTranslations[projectLanguage]}
          </Highlight>
        </Text>
      </Td>
      <Td w='45%'>
        <Text fontSize='sm' fontWeight='light'>
          <Highlight query={searchTerm} styles={{ bg: 'red.100' }}>
            {row.excludedNode.labelTranslations[projectLanguage]}
          </Highlight>
        </Text>
      </Td>
      <Td>
        {isAdminOrClinician && (
          <Button onClick={() => onDestroyNodeExclusion(row.id)}>
            {t('delete')}
          </Button>
        )}
      </Td>
    </Tr>
  )
}

export default DiagnosisExclusionRow
