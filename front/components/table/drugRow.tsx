/**
 * The external imports
 */
import React, { useCallback, useState, useContext, useEffect } from 'react'
import { useTranslation } from 'next-i18next'
import { CheckIcon } from '@chakra-ui/icons'
import {
  Tr,
  Td,
  Highlight,
  Button,
  Box,
  Skeleton,
  Table,
  Tbody,
  Th,
  Thead,
  Text,
  VStack,
} from '@chakra-ui/react'

/**
 * The internal imports
 */
import { AlertDialogContext, ModalContext } from '@/lib/contexts'
import { DrugStepper, MenuCell } from '@/components'
import { BackIcon } from '@/assets/icons'
import { useToast } from '@/lib/hooks'
import { useDestroyDrugMutation } from '@/lib/api/modules/drug'
import type { DrugRowComponent } from '@/types'
import { LEVEL_OF_URGENCY_GRADIENT } from '@/lib/config/constants'

const DrugRow: DrugRowComponent = ({
  row,
  language,
  searchTerm,
  isAdminOrClinician,
  projectId,
}) => {
  const { t } = useTranslation('datatable')
  const { newToast } = useToast()

  const [isOpen, setIsOpen] = useState(false)

  const { openAlertDialog } = useContext(AlertDialogContext)
  const { openModal } = useContext(ModalContext)

  const exclusions = []
  const isLoading = false

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
      openModal({
        content: <DrugStepper projectId={projectId} drugId={String(id)} />,
        size: '5xl',
      })
    },
    [t]
  )

  const handleAddExclusion = () => {
    console.log('add a new exclusion')
  }

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
      {isOpen && (
        <Tr>
          <Td p={0} colSpan={4} pl={8} bg='gray.100'>
            <Table data-cy='diagnoses_row'>
              <Thead>
                <Tr>
                  <Th>Name</Th>
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
                  {exclusions.length === 0 && (
                    <Tr>
                      <Td colSpan={3}>
                        <Text fontWeight='normal'>{t('noData')}</Text>
                      </Td>
                    </Tr>
                  )}
                  {exclusions.map(edge => (
                    <Tr key={`diagnosis-${edge.node.id}`}>
                      <Td borderColor='gray.300' w='50%'>
                        <Highlight
                          query={searchTerm}
                          styles={{ bg: 'red.100' }}
                        >
                          Amoxicillin po
                        </Highlight>
                      </Td>
                      <Td borderColor='gray.300'>
                        <Box
                          borderRadius='full'
                          height={8}
                          width={8}
                          display='flex'
                          justifyContent='center'
                          alignItems='center'
                          bg={
                            LEVEL_OF_URGENCY_GRADIENT[
                              edge.node.levelOfUrgency - 1
                            ]
                          }
                        >
                          {edge.node.levelOfUrgency}
                        </Box>
                      </Td>
                      <Td borderColor='gray.300' textAlign='center'>
                        <Button onClick={() => console.log('TODO')}>
                          {t('delete')}
                        </Button>
                      </Td>
                    </Tr>
                  ))}
                  <Tr flex={1}>
                    <Td bg='pink.300' colSpan={2}>
                      <Button variant='outline' onClick={handleAddExclusion}>
                        Add exclusion
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

export default DrugRow
