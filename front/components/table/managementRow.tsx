/**
 * The external imports
 */
import React, { useContext, useCallback, useEffect } from 'react'
import { Td, Highlight } from '@chakra-ui/react'
import { useTranslation } from 'next-i18next'

/**
 * The internal imports
 */
import { ModalContext } from '@/lib/contexts'
import { ManagementForm, NodeRow } from '@/components'
import { CheckIcon } from '@/assets/icons'
import { useToast } from '@/lib/hooks'
import {
  useDestroyManagementMutation,
  useGetManagementQuery,
  useLazyGetManagementQuery,
  useLazyGetManagementsQuery,
} from '@/lib/api/modules'
import type { RowComponent, Scalars } from '@/types'

const ManagementRow: RowComponent = ({
  row,
  language,
  searchTerm,
  isAdminOrClinician,
  projectId,
}) => {
  const { t } = useTranslation('datatable')
  const { newToast } = useToast()

  const { open: openModal } = useContext(ModalContext)

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
        content: (
          <ManagementForm managementId={managementId} projectId={projectId} />
        ),
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
      isAdminOrClinician={isAdminOrClinician}
      projectId={projectId}
      nodeType='management'
      nodeQuery={useGetManagementQuery}
      lazyNodeQuery={useLazyGetManagementQuery}
      lazyNodesQuery={useLazyGetManagementsQuery}
      onEdit={onEditManagement}
      destroyNode={destroyManagement}
    >
      <Td>
        <Highlight query={searchTerm} styles={{ bg: 'red.100' }}>
          {row.labelTranslations[language]}
        </Highlight>
      </Td>
      <Td>{row.isNeonat && <CheckIcon h={8} w={8} color='success' />}</Td>
      <Td>{row.isReferral && <CheckIcon h={8} w={8} color='success' />}</Td>
    </NodeRow>
  )
}

export default ManagementRow
