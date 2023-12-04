/**
 * The external imports
 */
import React, { useCallback, useEffect } from 'react'
import { useTranslation } from 'next-i18next'
import { Td, Highlight, VStack, Text } from '@chakra-ui/react'

/**
 * The internal imports
 */
import DrugStepper from '@/components/forms/drugStepper'
import NodeRow from '@/components/table/nodeRow'
import CheckIcon from '@/assets/icons/Check'
import { useToast } from '@/lib/hooks/useToast'
import { useModal } from '@/lib/hooks/useModal'
import {
  useDestroyDrugMutation,
  useGetDrugQuery,
  useLazyGetDrugQuery,
  useLazyGetDrugsQuery,
} from '@/lib/api/modules/enhanced/drug.enhanced'
import type { RowComponent, Scalars } from '@/types'

const DrugRow: RowComponent = ({ row, language, searchTerm }) => {
  const { t } = useTranslation('datatable')
  const { newToast } = useToast()
  const { open: openModal } = useModal()

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
        content: <DrugStepper drugId={id} />,
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

  return (
    <NodeRow
      row={row}
      searchTerm={searchTerm}
      nodeType='drug'
      nodeQuery={useGetDrugQuery}
      lazyNodeQuery={useLazyGetDrugQuery}
      lazyNodesQuery={useLazyGetDrugsQuery}
      onEdit={onEditDrug}
      destroyNode={destroyDrug}
    >
      <Td>
        <VStack alignItems='left'>
          <Text fontSize='sm' fontWeight='light'>
            {row.fullReference}
          </Text>
          <Text>
            <Highlight query={searchTerm} styles={{ bg: 'red.100' }}>
              {row.labelTranslations[language]}
            </Highlight>
          </Text>
        </VStack>
      </Td>
      <Td>{row.isAntibiotic && <CheckIcon h={8} w={8} color='success' />}</Td>
      <Td>{row.isAntiMalarial && <CheckIcon h={8} w={8} color='success' />}</Td>
      <Td>{row.isNeonat && <CheckIcon h={8} w={8} color='success' />}</Td>
    </NodeRow>
  )
}

export default DrugRow
