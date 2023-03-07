/**
 * The external imports
 */
import { useContext, FC } from 'react'
import { useTranslation } from 'next-i18next'
import {
  Box,
  Flex,
  Text,
  VStack,
  Button,
  Skeleton,
  HStack,
  IconButton,
  Heading,
  Divider,
  Menu,
  MenuButton,
  MenuList,
  MenuItem,
} from '@chakra-ui/react'

/**
 * The internal imports
 */
import {
  useGetDiagnosesQuery,
  useGetProjectQuery,
} from '@/lib/services/modules'
import { useToast } from '@/lib/hooks'
import { DeleteIcon } from '@/assets/icons'
import { ModalContext } from '@/lib/contexts'
import type { Project } from '@/types'

type DecisionTreeSummaryProps = {
  algorithmId: number
  projectId: number
  decisionTreeId: number
  prevStep: () => void
  setDiagnosisId: React.Dispatch<React.SetStateAction<number | undefined>>
}

const DecisionTreeSummary: FC<DecisionTreeSummaryProps> = ({
  algorithmId,
  projectId,
  decisionTreeId,
  prevStep,
  setDiagnosisId,
}) => {
  const { t } = useTranslation('decisionTrees')
  const { closeModal } = useContext(ModalContext)
  const { newToast } = useToast()

  const { data: diagnoses, isSuccess } = useGetDiagnosesQuery({
    algorithmId,
    decisionTreeId,
  })

  const { data: project = {} as Project } = useGetProjectQuery(projectId)

  /**
   * Sets the parent state with the diagnosis to be edited
   * and moves to the previous step
   * @param {*} id diagnosisId
   */
  const editDiagnosis = (id: number) => {
    setDiagnosisId(id)
    prevStep()
  }

  /**
   * Called after confirmation of deletion, and launches the deletion mutation
   * @param {*} id diagnosisId
   */
  const deleteDiagnosis = (id: number) => {
    // TODO : Integrate Quentin's branch feature/delete-diagnosis after PR merge
    console.log(id)
  }

  /**
   * If create successful, queue the toast and close the modal
   */
  const closeStepper = () => {
    newToast({
      message: t('notifications.createSuccess', { ns: 'common' }),
      status: 'success',
    })
    closeModal()
  }

  return (
    <VStack spacing={4} alignItems='flex-end'>
      <Box borderRadius='lg' borderWidth={1} p={6} w='full'>
        <Heading variant='h3' mb={6}>
          {t('allDiagnoses')}
        </Heading>
        <VStack spacing={6}>
          {isSuccess ? (
            diagnoses.edges.map(edge => (
              <Flex
                key={`diagnosis_${edge.node.id}`}
                w='full'
                alignItems='center'
                justifyContent='space-between'
              >
                <Text flex={1}>
                  {edge.node.labelTranslations[project.language.code]}
                </Text>
                <HStack spacing={8}>
                  <Button
                    px={8}
                    onClick={() => editDiagnosis(edge.node.id)}
                    data-cy='edit_diagnosis'
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
            ))
          ) : (
            <Skeleton h={10} />
          )}
          <Divider />
          <Button variant='outline' data-cy='add_diagnosis' onClick={prevStep}>
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

export default DecisionTreeSummary
