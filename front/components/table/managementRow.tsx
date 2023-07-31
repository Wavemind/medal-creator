/**
 * The external imports
 */
import React, { useState, useContext, useCallback, useEffect } from 'react'
import {
  Tr,
  Td,
  Button,
  Highlight,
  Text,
  Skeleton,
  Table,
  Tbody,
  Th,
  Thead,
} from '@chakra-ui/react'
import { useTranslation } from 'next-i18next'

/**
 * The internal imports
 */
import { AlertDialogContext, ModalContext } from '@/lib/contexts'
import { ManagementForm, MenuCell } from '@/components'
import { BackIcon, CheckIcon } from '@/assets/icons'
import {
  useDestroyManagementMutation,
  useGetProjectQuery,
  useLazyGetManagementQuery,
} from '@/lib/api/modules'
import { useToast, useAppRouter } from '@/lib/hooks'
import type { ManagementRowComponent, Scalars } from '@/types'
import { extractTranslation } from '@/lib/utils'

const ManagementRow: ManagementRowComponent = ({
  row,
  language,
  searchTerm,
  isAdminOrClinician,
}) => {
  const { t } = useTranslation('datatable')
  const {
    query: { projectId },
  } = useAppRouter()
  const { newToast } = useToast()

  const [isOpen, setIsOpen] = useState(false)

  const { open: openModal } = useContext(ModalContext)
  const { open: openAlertDialog } = useContext(AlertDialogContext)

  const { data: project } = useGetProjectQuery({
    id: projectId,
  })

  const [getManagement, { data: management, isLoading }] =
    useLazyGetManagementQuery()

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

  /**
   * Callback to handle the suppression of a management
   */
  const onDestroy = useCallback(
    (managementId: Scalars['ID']) => {
      openAlertDialog({
        title: t('delete'),
        content: t('areYouSure', { ns: 'common' }),
        action: () => destroyManagement({ id: managementId }),
      })
    },
    [t]
  )

  /**
   * Open or close list of managements exclusions releated to current management
   */
  const toggleOpen = () => {
    if (!isOpen) {
      getManagement({ id: row.id })
    }
    setIsOpen(prev => !prev)
  }

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
    <React.Fragment>
      <Tr data-cy='datatable_row'>
        <Td>
          <Highlight query={searchTerm} styles={{ bg: 'red.100' }}>
            {row.labelTranslations[language]}
          </Highlight>
        </Td>
        <Td>{row.isNeonat && <CheckIcon h={8} w={8} color='success' />}</Td>
        <Td textAlign='right'>
          {isAdminOrClinician && (
            <MenuCell
              itemId={row.id}
              canEdit={!row.hasInstances && !row.isDefault}
              onEdit={onEditManagement}
              onDestroy={isAdminOrClinician ? onDestroy : undefined}
              canDestroy={!row.hasInstances && !row.isDefault}
            />
          )}
          <Button
            data-cy='datatable_open_management'
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
            <Table data-cy='drug_exclusion_row'>
              <Thead>
                <Tr>
                  <Th>{t('drugs.name')}</Th>
                  <Th />
                </Tr>
              </Thead>
              {isLoading ? (
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
                  {management?.excludedNodes.length === 0 && (
                    <Tr>
                      <Td colSpan={3}>
                        <Text fontWeight='normal'>{t('noData')}</Text>
                      </Td>
                    </Tr>
                  )}
                  {management?.excludedNodes.map(node => (
                    <Tr key={`drug-${node.id}`}>
                      <Td borderColor='gray.300'>
                        <Highlight
                          query={searchTerm}
                          styles={{ bg: 'red.100' }}
                        >
                          {extractTranslation(
                            node.labelTranslations,
                            project?.language.code
                          )}
                        </Highlight>
                      </Td>
                      <Td borderColor='gray.300' textAlign='center'>
                        <Button onClick={() => onDestroyNodeExclusion(node.id)}>
                          {t('delete')}
                        </Button>
                      </Td>
                    </Tr>
                  ))}
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

export default ManagementRow
