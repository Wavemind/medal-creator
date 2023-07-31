/**
 * The external imports
 */
import React, { useCallback, useState, useContext, useEffect, FC } from 'react'
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
} from '@chakra-ui/react'

/**
 * The internal imports
 */
import { AlertDialogContext, ModalContext } from '@/lib/contexts'
import { ExcludedNodes, MenuCell } from '@/components'
import { BackIcon } from '@/assets/icons'
import { useToast } from '@/lib/hooks'
import {
  useGetProjectQuery,
  useDestroyNodeExclusionMutation,
} from '@/lib/api/modules'
import { extractTranslation } from '@/lib/utils'
import type { NodeRowComponent, Scalars } from '@/types'
import type { ExcludedNodesFragment } from '@/lib/api/modules/generated/fragments.generated'

const NodeRow: FC<NodeRowComponent> = ({
  row,
  searchTerm,
  isAdminOrClinician,
  projectId,
  nodeType,
  nodeQuery,
  lazyNodeQuery,
  lazyNodesQuery,
  children,
  onEdit,
  onDestroy,
}) => {
  const { t } = useTranslation('datatable')
  const { newToast } = useToast()

  const [isOpen, setIsOpen] = useState(false)

  const { open: openAlertDialog } = useContext(AlertDialogContext)
  const { open: openModal } = useContext(ModalContext)

  const { data: project } = useGetProjectQuery({
    id: projectId,
  })

  const [getNode, { data: node, isLoading: isNodeLoading }] = lazyNodeQuery()

  const [
    destroyNodeExclusion,
    {
      isSuccess: isDestroyDrugExclusionSuccess,
      isError: isDestroyDrugExclusionError,
    },
  ] = useDestroyNodeExclusionMutation()

  /**
   * Callback to on the alert dialog to destroy a node exclusion
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
   * Callback to open the modal to add an exclusion
   */
  const handleAddExclusion = useCallback(() => {
    if (node) {
      openModal({
        title: t('exclusions.newExclusion'),
        content: (
          <ExcludedNodes
            projectId={projectId}
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

  // TODO : Tests
  return (
    <React.Fragment>
      <Tr data-cy='datatable_row'>
        {children}
        <Td textAlign='right'>
          {isAdminOrClinician && (
            <MenuCell
              itemId={row.id}
              canEdit={!row.hasInstances && !row.isDefault}
              onEdit={onEdit}
              onDestroy={onDestroy}
              canDestroy={!row.hasInstances && !row.isDefault}
            />
          )}
          <Button
            data-cy='datatable_open_node'
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
            <Table data-cy='node_exclusion_row'>
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
                              project?.language.code
                            )}
                          </Highlight>
                        </Td>
                        <Td w='20%' borderColor='gray.300' textAlign='center'>
                          <Button
                            onClick={() =>
                              onDestroyNodeExclusion(excludedNode.id)
                            }
                          >
                            {t('delete')}
                          </Button>
                        </Td>
                      </Tr>
                    )
                  )}
                  <Tr>
                    <Td colSpan={2} textAlign='center'>
                      <Button variant='outline' onClick={handleAddExclusion}>
                        {t('addExclusion')}
                      </Button>
                    </Td>
                  </Tr>
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
