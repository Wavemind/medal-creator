/**
 * The external imports
 */
import React, { useCallback, useContext, useEffect } from 'react'
import { useTranslation } from 'next-i18next'
import { Td, Highlight } from '@chakra-ui/react'

/**
 * The internal imports
 */
import { ModalContext } from '@/lib/contexts'
import { DrugStepper, NodeRow } from '@/components'
import { CheckIcon } from '@/assets/icons'
import { useToast } from '@/lib/hooks'
import {
  useDestroyDrugMutation,
  useGetDrugQuery,
  useLazyGetDrugQuery,
  useLazyGetDrugsQuery,
} from '@/lib/api/modules'
import type { RowComponent, Scalars } from '@/types'

const DrugRow: RowComponent = ({
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
    destroyDrug,
    { isSuccess: isDestroyDrugSuccess, isError: isDestroyDrugError },
  ] = useDestroyDrugMutation()

  /**
   * Callback to handle the info action in the table menu
   */
  const onEditDrug = useCallback(
    (id: Scalars['ID']): void => {
      openModal({
        content: <DrugStepper projectId={projectId} drugId={id} />,
        size: '5xl',
      })
    },
    [t]
  )

  useEffect(() => {
    if (isDestroyDrugSuccess) {
      newToast({
        message: t('notifications.destroySuccess', { ns: 'common' }),
        status: 'success',
      })
    }
  }, [isDestroyDrugSuccess])

  useEffect(() => {
    if (isDestroyDrugError) {
      newToast({
        message: t('notifications.destroyError', { ns: 'common' }),
        status: 'error',
      })
    }
  }, [isDestroyDrugError])

  // TODO : Tests
  return (
    <NodeRow
      row={row}
      searchTerm={searchTerm}
      isAdminOrClinician={isAdminOrClinician}
      projectId={projectId}
      nodeType='drug'
      nodeQuery={useGetDrugQuery}
      lazyNodeQuery={useLazyGetDrugQuery}
      lazyNodesQuery={useLazyGetDrugsQuery}
      onEdit={onEditDrug}
      destroyNode={destroyDrug}
    >
      <Td>
        <Highlight query={searchTerm} styles={{ bg: 'red.100' }}>
          {row.labelTranslations[language || 'en']}
        </Highlight>
      </Td>
      <Td>{row.isAntibiotic && <CheckIcon h={8} w={8} color='success' />}</Td>
      <Td>{row.isAntiMalarial && <CheckIcon h={8} w={8} color='success' />}</Td>
      <Td>{row.isNeonat && <CheckIcon h={8} w={8} color='success' />}</Td>
    </NodeRow>
  )
}

export default DrugRow
