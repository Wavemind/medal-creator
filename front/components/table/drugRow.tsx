/**
 * The external imports
 */
import React, { useCallback, useContext, useEffect } from 'react'
import { useTranslation } from 'next-i18next'
import { Td, Highlight } from '@chakra-ui/react'

/**
 * The internal imports
 */
import { AlertDialogContext, ModalContext } from '@/lib/contexts'
import { DrugStepper } from '@/components'
import { CheckIcon } from '@/assets/icons'
import { useToast } from '@/lib/hooks'
import {
  GetDrug,
  useDestroyDrugMutation,
  useLazyGetDrugQuery,
} from '@/lib/api/modules'
import type { DrugRowComponent, Scalars } from '@/types'
import NodeRow from './nodeRow'
import { GetDrugDocument } from '@/lib/api/modules/generated/drug.generated'

const DrugRow: DrugRowComponent = ({
  row,
  language,
  searchTerm,
  isAdminOrClinician,
  projectId,
}) => {
  const { t } = useTranslation('datatable')
  const { newToast } = useToast()

  const { open: openAlertDialog } = useContext(AlertDialogContext)
  const { open: openModal } = useContext(ModalContext)

  const [
    destroyDrug,
    { isSuccess: isDestroyDrugSuccess, isError: isDestroyDrugError },
  ] = useDestroyDrugMutation()

  /**
   * Callback to the information panel of a drug
   */
  const onDestroyDrug = useCallback(
    (id: Scalars['ID']): void => {
      openAlertDialog({
        title: t('delete'),
        content: t('areYouSure', { ns: 'common' }),
        action: () => destroyDrug({ id }),
      })
    },
    [t]
  )

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
    <NodeRow<GetDrug>
      row={row}
      searchTerm={searchTerm}
      isAdminOrClinician={isAdminOrClinician}
      projectId={projectId}
      nodeType='drug'
      nodeQuery={useLazyGetDrugQuery}
      onEdit={onEditDrug}
      onDestroy={onDestroyDrug}
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
