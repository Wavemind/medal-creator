/**
 * The external imports
 */
import React, { useCallback, useEffect } from 'react'
import { Td, Highlight, VStack, Text } from '@chakra-ui/react'
import { useTranslation } from 'next-i18next'

/**
 * The internal imports
 */
import ManagementForm from '@/components/forms/management'
import NodeRow from '@/components/table/nodeRow'
import CheckIcon from '@/assets/icons/Check'
import { useToast } from '@/lib/hooks/useToast'
import { useModal } from '@/lib/hooks/useModal'
import {
  useDestroyManagementMutation,
  useGetManagementQuery,
  useLazyGetManagementQuery,
  useLazyGetManagementsQuery,
} from '@/lib/api/modules/enhanced/management.enhanced'
import type { RowComponent, Scalars } from '@/types'

const ManagementRow: RowComponent = ({ row, language, searchTerm }) => {
  const { t } = useTranslation('datatable')
  const { newToast } = useToast()

  const { open: openModal } = useModal()

  const [
    destroyManagement,
    {
      isSuccess: isDestroyManagementSuccess,
      isError: isDestroyManagementError,
    },
  ] = useDestroyManagementMutation()

  /**
   * Callback to open the modal to edit a management
   */
  const onEditManagement = useCallback(
    (managementId: Scalars['ID']) => {
      openModal({
        title: t('edit', { ns: 'managements' }),
        content: <ManagementForm managementId={managementId} />,
      })
    },
    [t]
  )

  useEffect(() => {
    if (isDestroyManagementSuccess) {
      newToast({
        message: t('notifications.destroySuccess', { ns: 'common' }),
        status: 'success',
      })
    }
  }, [isDestroyManagementSuccess])

  useEffect(() => {
    if (isDestroyManagementError) {
      newToast({
        message: t('notifications.destroyError', { ns: 'common' }),
        status: 'error',
      })
    }
  }, [isDestroyManagementError])

  return (
    <NodeRow
      row={row}
      searchTerm={searchTerm}
      nodeType='management'
      nodeQuery={useGetManagementQuery}
      lazyNodeQuery={useLazyGetManagementQuery}
      lazyNodesQuery={useLazyGetManagementsQuery}
      onEdit={onEditManagement}
      destroyNode={destroyManagement}
    >
      <Td>
        <VStack alignItems='left'>
          <Text fontSize='sm' fontWeight='light'>
            <Highlight query={searchTerm} styles={{ bg: 'red.100' }}>
              {row.fullReference}
            </Highlight>
          </Text>
          <Text whiteSpace='normal'>
            <Highlight query={searchTerm} styles={{ bg: 'red.100' }}>
              {row.labelTranslations[language]}
            </Highlight>
          </Text>
        </VStack>
      </Td>
      <Td>{row.isNeonat && <CheckIcon h={8} w={8} color='success' />}</Td>
      <Td>{row.isReferral && <CheckIcon h={8} w={8} color='success' />}</Td>
    </NodeRow>
  )
}

export default ManagementRow
