/**
 * The external imports
 */
import React, { useCallback, useState, useContext, useEffect } from 'react'
import { useTranslation } from 'next-i18next'
import { CheckIcon } from '@chakra-ui/icons'
import { Tr, Td, Highlight, Button } from '@chakra-ui/react'

/**
 * The internal imports
 */
import { AlertDialogContext } from '@/lib/contexts'
import { MenuCell } from '@/components'
import { BackIcon } from '@/assets/icons'
import { useToast } from '@/lib/hooks'
import { useDestroyDrugMutation } from '@/lib/api/modules/drug'
import type { DrugRowComponent } from '@/types'

const DrugRow: DrugRowComponent = ({
  row,
  language,
  searchTerm,
  isAdminOrClinician,
}) => {
  const { t } = useTranslation('datatable')
  const { newToast } = useToast()

  const [isOpen, setIsOpen] = useState(false)

  const { openAlertDialog } = useContext(AlertDialogContext)

  const [
    destroyDrug,
    { isSuccess: isDestroyDrugSuccess, isError: isDestroyDrugError },
  ] = useDestroyDrugMutation()

  /**
   * Callback to the information panel of a drug
   */
  const onDestroy = useCallback(
    (id: number): void => {
      openAlertDialog({
        title: t('delete'),
        content: t('areYouSure', { ns: 'common' }),
        action: () => destroyDrug(id),
      })
    },
    [t]
  )

  /**
   * Callback to handle the info action in the table menu
   */
  const onEdit = useCallback(
    (id: number): void => {
      console.log('handle edit', id)
    },
    [t]
  )

  /**
   * Open or close list of diagnoses and fetch releated diagnoses
   */
  const toggleOpen = () => {
    if (!isOpen) {
      console.log('get excluded drugs')
    }
    setIsOpen(prev => !prev)
  }

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
    <React.Fragment>
      <Tr data-cy='datatable_row'>
        <Td>
          <Highlight query={searchTerm} styles={{ bg: 'red.100' }}>
            {row.labelTranslations[language || 'en']}
          </Highlight>
        </Td>
        <Td>{row.isAntibiotic && <CheckIcon h={8} w={8} color='success' />}</Td>
        <Td>
          {row.isAntiMalarial && <CheckIcon h={8} w={8} color='success' />}
        </Td>
        <Td>{row.isNeonat && <CheckIcon h={8} w={8} color='success' />}</Td>
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
            data-cy='datatable_open_drug'
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
    </React.Fragment>
  )
}

export default DrugRow
