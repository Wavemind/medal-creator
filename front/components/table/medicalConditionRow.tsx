/**
 * The external imports
 */
import { useCallback, useEffect, useMemo } from 'react'
import { Highlight, Tag, Td, Tr, VStack, Text } from '@chakra-ui/react'
import { useTranslation } from 'next-i18next'

/**
 * The internal imports
 */
import { useDestroyQuestionsSequenceMutation } from '@/lib/api/modules/enhanced/questionSequences.enhanced'
import { extractTranslation } from '@/lib/utils/string'
import MenuCell from '@/components/table/menuCell'
import DiagramButton from '@/components/diagramButton'
import QuestionSequencesForm from '@/components/forms/questionsSequence'
import { useToast } from '@/lib/hooks/useToast'
import { useAlertDialog } from '@/lib/hooks/useAlertDialog'
import { useModal } from '@/lib/hooks/useModal'
import { useProject } from '@/lib/hooks/useProject'
import { useAppRouter } from '@/lib/hooks/useAppRouter'
import type { Scalars, QuestionsSequenceRowComponent } from '@/types'

const MedicalConditionRow: QuestionsSequenceRowComponent = ({
  row,
  searchTerm,
}) => {
  const { t } = useTranslation('questionsSequence')
  const { newToast } = useToast()
  const { open: openAlertDialog } = useAlertDialog()
  const { open: openModal } = useModal()
  const { isAdminOrClinician, projectLanguage } = useProject()
  const {
    query: { projectId },
  } = useAppRouter()

  const [
    destroyQuestionsSequence,
    { isSuccess: isDestroySuccess, isError: isDestroyError },
  ] = useDestroyQuestionsSequenceMutation()

  const diagramType = useMemo(() => {
    if (row.type === 'PredefinedSyndrome') {
      return 'questions-sequence'
    }
    return 'questions-sequence-scored'
  }, [row.type])

  const handleEditQuestionsSequence = useCallback(
    (questionSequencesId: Scalars['ID']) =>
      openModal({
        title: t('edit'),
        content: (
          <QuestionSequencesForm questionsSequenceId={questionSequencesId} />
        ),
      }),
    [t]
  )

  const onDestroy = useCallback(
    (questionSequencesId: Scalars['ID']) => {
      openAlertDialog({
        title: t('delete', { ns: 'datatable' }),
        content: t('areYouSure', { ns: 'common' }),
        action: () => destroyQuestionsSequence({ id: questionSequencesId }),
      })
    },
    [t]
  )

  useEffect(() => {
    if (isDestroySuccess) {
      newToast({
        message: t('notifications.destroySuccess', { ns: 'common' }),
        status: 'success',
      })
    }
  }, [isDestroySuccess])

  useEffect(() => {
    if (isDestroyError) {
      newToast({
        message: t('notifications.destroyError', { ns: 'common' }),
        status: 'error',
      })
    }
  }, [isDestroyError])

  return (
    <Tr data-testid='datatable-row'>
      <Td>
        <VStack alignItems='left'>
          <Text fontSize='sm' fontWeight='light'>
            {row.fullReference}
          </Text>
          <Text>
            <Highlight query={searchTerm} styles={{ bg: 'red.100' }}>
              {extractTranslation(row.labelTranslations, projectLanguage)}
            </Highlight>
          </Text>
        </VStack>
      </Td>

      <Td>
        {t(`categories.${row.type}.label`, {
          ns: 'variables',
          defaultValue: '',
        })}
      </Td>
      <Td>
        {row.nodeComplaintCategories?.map(ncc => (
          <Tag mx={1} key={`${row.id}-${ncc.id}`}>
            {extractTranslation(
              ncc.complaintCategory.labelTranslations,
              projectLanguage
            )}
          </Tag>
        ))}
      </Td>
      <Td>
        <DiagramButton
          href={`/projects/${projectId}/diagram/${diagramType}/${row.id}`}
        >
          {t('openDiagram', { ns: 'datatable' })}
        </DiagramButton>
      </Td>
      <Td>
        {isAdminOrClinician && (
          <MenuCell
            itemId={row.id}
            onDestroy={onDestroy}
            canDestroy={!row.hasInstances}
            onEdit={handleEditQuestionsSequence}
            canEdit={!row.hasInstances}
          />
        )}
      </Td>
    </Tr>
  )
}

export default MedicalConditionRow
