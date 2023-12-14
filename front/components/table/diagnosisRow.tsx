/**
 * The external imports
 */
import React, { useCallback, useEffect } from 'react'
import {
  Table,
  VStack,
  Tr,
  Td,
  Button,
  Skeleton,
  Tbody,
  Highlight,
  Text,
  Box,
  Th,
  Thead,
  Tooltip,
} from '@chakra-ui/react'
import { useTranslation } from 'next-i18next'

/**
 * The internal imports
 */
import MenuCell from '@/components/table/menuCell'
import DiagnosisDetail from '@/components/modal/diagnosisDetail'
import DiagnosisForm from '@/components/forms/diagnosis'
import DiagramButton from '@/components/diagramButton'
import {
  useDestroyDiagnosisMutation,
  useGetDiagnosesQuery,
} from '@/lib/api/modules/enhanced/diagnosis.enhanced'
import { useToast } from '@/lib/hooks/useToast'
import { useModal } from '@/lib/hooks/useModal'
import { useAlertDialog } from '@/lib/hooks/useAlertDialog'
import { useAppRouter } from '@/lib/hooks/useAppRouter'
import { useProject } from '@/lib/hooks/useProject'
import { LEVEL_OF_URGENCY_GRADIENT } from '@/lib/config/constants'
import { extractTranslation } from '@/lib/utils/string'
import { useAlgorithm } from '@/lib/hooks/useAlgorithm'
import type { DiagnosisRowComponent, Scalars } from '@/types'

const DiagnosisRow: DiagnosisRowComponent = ({
  decisionTreeId,
  searchTerm,
}) => {
  const { t } = useTranslation('datatable')
  const { newToast } = useToast()
  const { isAdminOrClinician } = useProject()

  const { projectLanguage } = useProject()
  const { open: openModal } = useModal()
  const { open: openAlertDialog } = useAlertDialog()

  const {
    query: { algorithmId, projectId },
  } = useAppRouter()

  const { data: diagnoses, isLoading } = useGetDiagnosesQuery({
    algorithmId: algorithmId,
    decisionTreeId,
  })

  const { isRestricted } = useAlgorithm(algorithmId)

  const [
    destroyDiagnosis,
    { isSuccess: isDiagnosisDestroySuccess, isError: isDiagnosisDestroyError },
  ] = useDestroyDiagnosisMutation()

  /**
   * Callback to handle the new form action in the table menu for a new diagnosis
   */
  const onNewDiagnosis = useCallback(() => {
    openModal({
      title: t('new', { ns: 'diagnoses' }),
      content: <DiagnosisForm decisionTreeId={decisionTreeId} />,
    })
  }, [])

  /**
   * Callback to handle the new form action in the table menu for a new diagnosis
   */
  const onEditDiagnosis = useCallback((diagnosisId: Scalars['ID']) => {
    openModal({
      title: t('edit', { ns: 'diagnoses' }),
      content: <DiagnosisForm diagnosisId={diagnosisId} />,
    })
  }, [])

  /**
   * Callback to handle the suppression of a decision tree
   */
  const onDiagnosisDestroy = useCallback((diagnosisId: Scalars['ID']) => {
    openAlertDialog({
      title: t('delete'),
      content: t('areYouSure', { ns: 'common' }),
      action: () => destroyDiagnosis({ id: diagnosisId }),
    })
  }, [])

  /**
   * Callback to handle the info action in the table menu
   */
  const onInfo = useCallback((diagnosisId: Scalars['ID']) => {
    openModal({
      content: <DiagnosisDetail diagnosisId={diagnosisId} />,
    })
  }, [])

  useEffect(() => {
    if (isDiagnosisDestroySuccess) {
      newToast({
        message: t('notifications.destroySuccess', { ns: 'common' }),
        status: 'success',
      })
    }
  }, [isDiagnosisDestroySuccess])

  useEffect(() => {
    if (isDiagnosisDestroyError) {
      newToast({
        message: t('notifications.destroyError', { ns: 'common' }),
        status: 'error',
      })
    }
  }, [isDiagnosisDestroyError])

  return (
    <Tr>
      <Td p={0} colSpan={5} pl={8} bg='gray.100'>
        <Table data-testid='diagnoses-row'>
          <Thead>
            <Tr>
              <Th>{t('diagnoses.diagnosis')}</Th>
              <Th>{t('diagnoses.levelOfUrgency')}</Th>
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
              {diagnoses?.edges.length === 0 && (
                <Tr>
                  <Td colSpan={4}>
                    <Text fontWeight='normal'>{t('noData')}</Text>
                  </Td>
                </Tr>
              )}
              {diagnoses?.edges.map(edge => (
                <Tr
                  key={`diagnosis-${edge.node.id}`}
                  data-testid='diagnosis-row'
                >
                  <Td borderColor='gray.300' w='50%'>
                    <VStack alignItems='left'>
                      <Text fontSize='sm' fontWeight='light'>
                        <Highlight
                          query={searchTerm}
                          styles={{ bg: 'red.100' }}
                        >
                          {edge.node.fullReference}
                        </Highlight>
                      </Text>
                      <Text>
                        <Highlight
                          query={searchTerm}
                          styles={{ bg: 'red.100' }}
                        >
                          {extractTranslation(
                            edge.node.labelTranslations,
                            projectLanguage
                          )}
                        </Highlight>
                      </Text>
                    </VStack>
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
                        LEVEL_OF_URGENCY_GRADIENT[edge.node.levelOfUrgency - 1]
                      }
                    >
                      {edge.node.levelOfUrgency}
                    </Box>
                  </Td>
                  <Td borderColor='gray.300' textAlign='center'>
                    <DiagramButton
                      href={`/projects/${projectId}/diagram/diagnosis/${edge.node.id}`}
                    >
                      {t('openTreatment')}
                    </DiagramButton>
                  </Td>
                  <Td textAlign='right' borderColor='gray.300'>
                    <MenuCell
                      itemId={edge.node.id}
                      onInfo={onInfo}
                      onEdit={isAdminOrClinician ? onEditDiagnosis : undefined}
                      onDestroy={
                        isAdminOrClinician ? onDiagnosisDestroy : undefined
                      }
                      canDestroy={!edge.node.hasInstances && !isRestricted}
                    />
                  </Td>
                </Tr>
              ))}
              <Tr>
                {isAdminOrClinician && (
                  <Td colSpan={4} textAlign='center'>
                    <Tooltip
                      label={t('tooltip.inProduction', { ns: 'common' })}
                      hasArrow
                      isDisabled={!isRestricted}
                    >
                      <Button
                        variant='outline'
                        onClick={onNewDiagnosis}
                        isDisabled={isRestricted}
                      >
                        {t('addDiagnosis')}
                      </Button>
                    </Tooltip>
                  </Td>
                )}
              </Tr>
            </Tbody>
          )}
        </Table>
      </Td>
    </Tr>
  )
}

export default DiagnosisRow
