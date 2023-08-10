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
import DrugStepper from '@/components/forms/drugStepper'
import ExcludedDrugs from '@/components/modal/excludedDrugs'
import MenuCell from './menuCell'
import BackIcon from '@/assets/icons/Back'
import { useToast } from '@/lib/hooks'
import {
  useDestroyDrugMutation,
  useLazyGetDrugQuery,
  useGetProjectQuery,
  useDestroyNodeExclusionMutation,
} from '@/lib/api/modules'
import { extractTranslation } from '@/lib/utils/string'
import type { DrugRowComponent, Scalars } from '@/types'

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

  const { open: openAlertDialog } = useContext(AlertDialogContext)
  const { open: openModal } = useContext(ModalContext)

  const { data: project } = useGetProjectQuery({
    id: projectId,
  })

  const [getDrug, { data: drug, isLoading }] = useLazyGetDrugQuery()

  const [
    destroyDrug,
    { isSuccess: isDestroyDrugSuccess, isError: isDestroyDrugError },
  ] = useDestroyDrugMutation()

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

  /**
   * Callback to open the modal to add an exclusion
   */
  const handleAddExclusion = useCallback(() => {
    if (drug) {
      openModal({
        title: t('drugs.newDrugExclusion'),
        content: <ExcludedDrugs projectId={projectId} drugId={drug.id} />,
        size: '4xl',
      })
    }
  }, [])

  /**
   * Open or close list of diagnoses and fetch releated diagnoses
   */
  const toggleOpen = () => {
    if (!isOpen) {
      getDrug({ id: row.id })
    }
    setIsOpen(prev => !prev)
  }

  useEffect(() => {
    if (isDestroyDrugSuccess || isDestroyDrugExclusionSuccess) {
      newToast({
        message: t('notifications.destroySuccess', { ns: 'common' }),
        status: 'success',
      })
    }
  }, [isDestroyDrugSuccess, isDestroyDrugExclusionSuccess])

  useEffect(() => {
    if (isDestroyDrugError || isDestroyDrugExclusionError) {
      newToast({
        message: t('notifications.destroyError', { ns: 'common' }),
        status: 'error',
      })
    }
  }, [isDestroyDrugError, isDestroyDrugExclusionError])

  // TODO : Tests
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
              onEdit={onEditDrug}
              onDestroy={onDestroyDrug}
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
                  {drug?.excludedNodes.length === 0 && (
                    <Tr>
                      <Td colSpan={3}>
                        <Text fontWeight='normal'>{t('noData')}</Text>
                      </Td>
                    </Tr>
                  )}
                  {drug?.excludedNodes.map(node => (
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

export default DrugRow
