/**
 * The external imports
 */
import { useTranslation } from 'next-i18next'
import {
  Box,
  Flex,
  Text,
  VStack,
  Button,
  HStack,
  IconButton,
  Heading,
  Divider,
  Menu,
  MenuButton,
  MenuList,
  MenuItem,
  Spinner,
} from '@chakra-ui/react'

/**
 * The internal imports
 */
import {
  useDestroyDiagnosisMutation,
  useGetDiagnosesQuery,
} from '@/lib/api/modules/enhanced/diagnosis.enhanced'
import { useToast, useModal, useProject } from '@/lib/hooks'
import DeleteIcon from '@/assets/icons/Delete'
import { extractTranslation } from '@/lib/utils/string'
import type { DecisionTreeSummaryComponent, Scalars } from '@/types'

const DecisionTreeSummary: DecisionTreeSummaryComponent = ({
  algorithmId,
  decisionTreeId,
  prevStep,
  setDiagnosisId,
}) => {
  const { t } = useTranslation('decisionTrees')
  const { close } = useModal()
  const { newToast } = useToast()
  const { projectLanguage } = useProject()

  const { data: diagnoses, isSuccess: getDiagnosesIsSuccess } =
    useGetDiagnosesQuery({
      algorithmId,
      decisionTreeId,
    })

  const [destroyDiagnosis] = useDestroyDiagnosisMutation()

  /**
   * Sets the parent state with the diagnosis to be edited
   * and moves to the previous step
   * @param {*} id diagnosisId
   */
  const editDiagnosis = (id: Scalars['ID']) => {
    setDiagnosisId(id)
    prevStep()
  }

  /**
   * Called after confirmation of deletion, and launches the deletion mutation
   * @param {*} id diagnosisId
   */
  const deleteDiagnosis = (diagnosisId: Scalars['ID']) =>
    destroyDiagnosis({ id: diagnosisId })

  /**
   * If create successful, queue the toast and close the modal
   */
  const closeStepper = () => {
    newToast({
      message: t('notifications.saveSuccess', { ns: 'common' }),
      status: 'success',
    })
    close()
  }

  if (getDiagnosesIsSuccess) {
    return (
      <VStack spacing={4} alignItems='flex-end'>
        <Box borderRadius='lg' borderWidth={1} p={6} w='full'>
          <Heading variant='h3' mb={6}>
            {t('allDiagnoses')}
          </Heading>
          <VStack spacing={6}>
            {diagnoses.edges.map(edge => (
              <Flex
                key={`diagnosis_${edge.node.id}`}
                w='full'
                alignItems='center'
                justifyContent='space-between'
              >
                <Text flex={1}>
                  {extractTranslation(
                    edge.node.labelTranslations,
                    projectLanguage
                  )}
                </Text>
                <HStack spacing={8}>
                  <Button
                    px={8}
                    onClick={() => editDiagnosis(edge.node.id)}
                    data-testid='edit-diagnosis'
                  >
                    {t('edit', { ns: 'common' })}
                  </Button>
                  <Menu>
                    <MenuButton
                      as={IconButton}
                      icon={<DeleteIcon />}
                      variant='ghost'
                    />
                    <MenuList>
                      <MenuItem
                        color='red'
                        fontWeight='bold'
                        onClick={() => deleteDiagnosis(edge.node.id)}
                      >
                        {t('confirm', { ns: 'common' })}
                      </MenuItem>
                      <MenuItem>{t('cancel', { ns: 'common' })}</MenuItem>
                    </MenuList>
                  </Menu>
                </HStack>
              </Flex>
            ))}
            <Divider />
            <Button
              variant='outline'
              data-testid='add-diagnosis'
              onClick={prevStep}
            >
              {t('addDiagnosis')}
            </Button>
          </VStack>
        </Box>
        <Button onClick={closeStepper} px={8}>
          {t('done', { ns: 'common' })}
        </Button>
      </VStack>
    )
  }

  return <Spinner size='xl' />
}

export default DecisionTreeSummary
