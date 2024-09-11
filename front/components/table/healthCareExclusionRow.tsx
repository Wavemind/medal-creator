/**
 * The external imports
 */
import React, { useCallback, useEffect, useMemo } from 'react'
import { useTranslation } from 'next-i18next'
import { Td, Highlight, Text, Tr, Button, Tooltip } from '@chakra-ui/react'

/**
 * The internal imports
 */
import { useDestroyNodeExclusionMutation } from '@/lib/api/modules/enhanced/nodeExclusion.enhanced'
import { extractTranslation } from '@/lib/utils/string'
import { useAlertDialog } from '@/lib/hooks/useAlertDialog'
import { useProject } from '@/lib/hooks/useProject'
import { useToast } from '@/lib/hooks/useToast'
import { HealthCareExclusionRowComponent } from '@/types'

const HealthCareExclusionRow: HealthCareExclusionRowComponent = ({
  row,
  searchTerm,
}) => {
  const { t } = useTranslation('datatable')
  const { newToast } = useToast()
  const { open: openAlertDialog } = useAlertDialog()
  const { isAdminOrClinician, projectLanguage } = useProject()

  const isDeployed = useMemo(
    () => row.excludedNode.isDeployed || row.excludingNode.isDeployed,
    [row]
  )

  const [
    destroyNodeExclusion,
    {
      isSuccess: isDestroyNodeExclusionSuccess,
      isError: isDestroyNodeExclusionError,
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
    if (isDestroyNodeExclusionSuccess) {
      newToast({
        message: t('notifications.destroySuccess', { ns: 'common' }),
        status: 'success',
      })
    }
  }, [isDestroyNodeExclusionSuccess])

  useEffect(() => {
    if (isDestroyNodeExclusionError) {
      newToast({
        message: t('notifications.destroyError', { ns: 'common' }),
        status: 'error',
      })
    }
  }, [isDestroyNodeExclusionError])

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
        <Text fontSize='sm' fontWeight='light' whiteSpace='normal'>
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
          <Tooltip
            label={t('tooltip.inProduction', { ns: 'datatable' })}
            isDisabled={!isDeployed}
            hasArrow
          >
            <Button
              data-testid='delete-health-care-exclusion'
              onClick={onDestroyNodeExclusion}
              isDisabled={isDeployed}
            >
              {t('delete')}
            </Button>
          </Tooltip>
        )}
      </Td>
    </Tr>
  )
}

export default HealthCareExclusionRow
