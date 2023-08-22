/**
 * The external imports
 */
import { useContext } from 'react'
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
import { useGetProjectQuery } from '@/lib/api/modules/enhanced/project.enhanced'
import { useToast } from '@/lib/hooks'
import DeleteIcon from '@/assets/icons/Delete'
import { ModalContext } from '@/lib/contexts'
import { extractTranslation } from '@/lib/utils/string'
import type { DecisionTreeSummaryComponent, Scalars } from '@/types'

const DecisionTreeSummary: DecisionTreeSummaryComponent = ({
  algorithmId,
  projectId,
  decisionTreeId,
  prevStep,
  setDiagnosisId,
}) => {
  const { t } = useTranslation('decisionTrees')
  const { close } = useContext(ModalContext)
  const { newToast } = useToast()

  const { data: diagnoses, isSuccess: getDiagnosesIsSuccess } =
    useGetDiagnosesQuery({
      algorithmId,
      decisionTreeId,
    })
  const { data: project, isSuccess: getProjectIsSuccess } = useGetProjectQuery({
    id: projectId,
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
      message: t('notifications.createSuccess', { ns: 'common' }),
      status: 'success',
    })
    close()
  }

  if (getDiagnosesIsSuccess && getProjectIsSuccess) {
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
                    project.language.code
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
