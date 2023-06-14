/**
 * The external imports
 */
import React, { useState, useContext, useCallback } from 'react'
import { Tr, Td, Button, Highlight, Text, Tooltip } from '@chakra-ui/react'
import { useTranslation } from 'next-i18next'
import { useRouter } from 'next/router'

/**
 * The internal imports
 */
import { AlertDialogContext, ModalContext } from '@/lib/contexts'
import { ManagementForm, MenuCell } from '@/components'
import { BackIcon } from '@/assets/icons'
import { CheckIcon } from '@/assets/icons'
import type { ManagementRowComponent } from '@/types'

const ManagementRow: ManagementRowComponent = ({
  row,
  language,
  searchTerm,
  isAdminOrClinician,
}) => {
  const { t } = useTranslation('datatable')
  const router = useRouter()

  const [isOpen, setIsOpen] = useState(false)

  const { openModal } = useContext(ModalContext)
  const { openAlertDialog } = useContext(AlertDialogContext)

  const { projectId } = router.query

  /**
   * Callback to handle the suppression of a management
   */
  const onDestroy = useCallback(
    (managementId: number): void => {
      openAlertDialog({
        title: t('delete', { ns: 'datatable' }),
        content: t('areYouSure', { ns: 'common' }),
        action: () => console.log('managementId', managementId),
      })
    },
    [t]
  )

  const onEditManagement = useCallback(
    (managementId: number) => {
      openModal({
        title: t('edit', { ns: 'managements' }),
        content: (
          <ManagementForm
            managementId={managementId}
            projectId={Number(projectId)}
          />
        ),
      })
    },
    [t]
  )

  /**
   * Open or close list of managements exclusions releated to current management
   */
  const toggleOpen = () => {
    if (!isOpen) {
      // TODO FETCH EXCLUSIONS
    }
    setIsOpen(prev => !prev)
  }

  return (
    <React.Fragment>
      <Tr data-cy='datatable_row'>
        <Td>
          <Highlight query={searchTerm} styles={{ bg: 'red.100' }}>
            {row.labelTranslations[language]}
          </Highlight>
        </Td>
        <Td textAlign='center'>
          {row.isNeonat && <CheckIcon h={8} w={8} color='success' />}
        </Td>
        <Td>
          {isAdminOrClinician && (
            <Tooltip
              label={t('hasInstances', { ns: 'datatable' })}
              hasArrow
              isDisabled={!row.isDefault}
            >
              <Button
                data-cy='management_edit_button'
                onClick={() => onEditManagement(row.id)}
                minW={24}
                isDisabled={row.isDefault}
              >
                {t('edit', { ns: 'datatable' })}
              </Button>
            </Tooltip>
          )}
        </Td>
        <Td textAlign='right'>
          <MenuCell
            itemId={row.id}
            onDestroy={isAdminOrClinician ? onDestroy : undefined}
            canDestroy={!row.hasInstances && !row.isDefault}
          />
          <Button
            data-cy='datatable_open_diagnosis'
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
            {t('showExclusions')}
          </Button>
        </Td>
      </Tr>
      {isOpen && (
        <Td>
          <Text>TODO</Text>
        </Td>
      )}
    </React.Fragment>
  )
}

export default ManagementRow
