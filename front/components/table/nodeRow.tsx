/**
 * The external imports
 */
import React, { useCallback, useState, useEffect, FC } from 'react'
import { useTranslation } from 'next-i18next'
import {
  Tr,
  Td,
  Highlight,
  Button,
  Skeleton,
  Table,
  Tbody,
  Th,
  Thead,
  Text,
  Tooltip,
} from '@chakra-ui/react'

/**
 * The internal imports
 */
import ExcludedNodes from '@/components/modal/excludedNodes'
import MenuCell from '@/components/table/menuCell'
import BackIcon from '@/assets/icons/Back'
import { useAlertDialog } from '@/lib/hooks/useAlertDialog'
import { useModal } from '@/lib/hooks/useModal'
import { useProject } from '@/lib/hooks/useProject'
import { useToast } from '@/lib/hooks/useToast'
import { useDestroyNodeExclusionMutation } from '@/lib/api/modules/enhanced/nodeExclusion.enhanced'
import { extractTranslation } from '@/lib/utils/string'
import type { NodeRowComponent, Scalars } from '@/types'
import type { ExcludedNodesFragment } from '@/lib/api/modules/generated/fragments.generated'

const NodeRow: FC<NodeRowComponent> = ({
  row,
  searchTerm,
  nodeType,
  nodeQuery,
  lazyNodeQuery,
  lazyNodesQuery,
  children,
  destroyNode,
  onEdit,
}) => {
  const { t } = useTranslation('datatable')
  const { newToast } = useToast()
  const { isAdminOrClinician, projectLanguage } = useProject()

  const [isOpen, setIsOpen] = useState(false)

  const { open: openAlertDialog } = useAlertDialog()
  const { open: openModal } = useModal()

  const [getNode, { data: node, isLoading: isNodeLoading }] = lazyNodeQuery()

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
    (excludedNodeId: Scalars['ID']): void => {
      openAlertDialog({
        title: t('delete'),
        content: t('areYouSure', { ns: 'common' }),
        action: () =>
          destroyNodeExclusion({ excludingNodeId: row.id, excludedNodeId }),
      })
    },
    [t]
  )

  /**
   * Callback to handle the suppression of a node
   */
  const onDestroy = useCallback(
    (nodeId: Scalars['ID']) => {
      openAlertDialog({
        title: t('delete'),
        content: t('areYouSure', { ns: 'common' }),
        action: () => destroyNode({ id: nodeId }),
      })
    },
    [t]
  )

  /**
   * Callback to open the modal to add an exclusion
   */
  const handleAddExclusion = useCallback(() => {
    if (node) {
      openModal({
        title: t('exclusions.newExclusion'),
        content: (
          <ExcludedNodes
            nodeId={node.id}
            nodeType={nodeType}
            nodeQuery={nodeQuery}
            lazyNodesQuery={lazyNodesQuery}
          />
        ),
        size: '4xl',
      })
    }
  }, [node])

  /**
   * Open or close list of diagnoses and fetch releated diagnoses
   */
  const toggleOpen = () => {
    if (!isOpen) {
      getNode({ id: row.id })
    }
    setIsOpen(prev => !prev)
  }

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
    <React.Fragment>
      <Tr data-testid='datatable-row'>
        {children}
        <Td textAlign='right'>
          {isAdminOrClinician && (
            <MenuCell
              itemId={row.id}
              canEdit={!row.isDefault}
              onEdit={onEdit}
              onDestroy={onDestroy}
              canDestroy={
                !row.hasInstances && !row.isDefault && !row.isDeployed
              }
            />
          )}
          <Button
            data-testid='datatable-open-node'
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
            {t('showExcluded', { ns: 'datatable' })}
          </Button>
        </Td>
      </Tr>
      {isOpen && (
        <Tr w='full'>
          <Td p={0} colSpan={5} pl={8} bg='gray.100'>
            <Table data-testid='node-exclusion-row'>
              <Thead>
                <Tr>
                  <Th>{t('exclusions.name')}</Th>
                  <Th />
                </Tr>
              </Thead>
              {isNodeLoading ? (
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
                <Tbody w='full'>
                  {node?.excludedNodes.length === 0 && (
                    <Tr>
                      <Td colSpan={3}>
                        <Text fontWeight='normal'>{t('noData')}</Text>
                      </Td>
                    </Tr>
                  )}
                  {node?.excludedNodes.map(
                    (excludedNode: ExcludedNodesFragment) => (
                      <Tr key={`node-${excludedNode.id}`}>
                        <Td borderColor='gray.300'>
                          <Highlight
                            query={searchTerm}
                            styles={{ bg: 'red.100' }}
                          >
                            {extractTranslation(
                              excludedNode.labelTranslations,
                              projectLanguage
                            )}
                          </Highlight>
                        </Td>
                        {isAdminOrClinician && (
                          <Td w='20%' borderColor='gray.300' textAlign='center'>
                            <Tooltip
                              label={t('tooltip.inProduction', {
                                ns: 'common',
                              })}
                              hasArrow
                              isDisabled={!row.isDeployed}
                            >
                              <Button
                                isDisabled={row.isDeployed}
                                onClick={() =>
                                  onDestroyNodeExclusion(excludedNode.id)
                                }
                              >
                                {t('delete')}
                              </Button>
                            </Tooltip>
                          </Td>
                        )}
                      </Tr>
                    )
                  )}
                  {isAdminOrClinician && (
                    <Tr>
                      <Td colSpan={2} textAlign='center'>
                        <Tooltip
                          label={t('tooltip.inProduction', { ns: 'common' })}
                          hasArrow
                          isDisabled={!row.isDeployed}
                        >
                          <Button
                            variant='outline'
                            onClick={handleAddExclusion}
                            isDisabled={row.isDeployed}
                          >
                            {t('addExclusion')}
                          </Button>
                        </Tooltip>
                      </Td>
                    </Tr>
                  )}
                </Tbody>
              )}
            </Table>
          </Td>
        </Tr>
      )}
    </React.Fragment>
  )
}

export default NodeRow
