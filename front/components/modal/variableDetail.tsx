/**
 * The external imports
 */
import { useMemo } from 'react'
import {
  VStack,
  Text,
  Box,
  Accordion,
  AccordionButton,
  AccordionIcon,
  AccordionItem,
  AccordionPanel,
  HStack,
  Spinner,
  Heading,
} from '@chakra-ui/react'
import { useTranslation } from 'next-i18next'

/**
 * The internal imports
 */
import { useGetVariableQuery } from '@/lib/api/modules/enhanced/variable.enhanced'
import { extractTranslation } from '@/lib/utils/string'
import { useAppRouter } from '@/lib/hooks/useAppRouter'
import { useProject } from '@/lib/hooks/useProject'
import DiagramButton from '@/components/diagramButton'
import Card from '@/components/card'
import type { DependenciesByAlgorithm, VariableComponent } from '@/types'

const VariableDetail: VariableComponent = ({ variableId }) => {
  const { t } = useTranslation('variables')
  const {
    query: { projectId },
  } = useAppRouter()

  const { projectLanguage } = useProject()

  const { data: variable, isSuccess: isSuccessVariable } = useGetVariableQuery({
    id: variableId,
  })

  /**
   * Designates whether a description exists for the variable
   */
  const hasDescription = useMemo(() => {
    if (variable) {
      return !!extractTranslation(
        variable.descriptionTranslations,
        projectLanguage
      )
    }
    return false
  }, [variable])

  /**
   * Calculate number of instanciated variable
   */
  const instanciationNumber = useMemo(() => {
    if (isSuccessVariable) {
      return variable.dependenciesByAlgorithm
        .map((dep: DependenciesByAlgorithm) => dep.dependencies.length)
        .reduce((sum: number, a: number) => sum + a, 0)
    }

    return 0
  }, [variable])

  if (isSuccessVariable) {
    return (
      <VStack spacing={10} align='left' w='full'>
        <Heading textAlign='center'>
          {extractTranslation(variable.labelTranslations, projectLanguage)}
        </Heading>
        <VStack spacing={4} align='left' w='full'>
          <Text fontWeight='bold'>{t('description')}</Text>
          <Text fontStyle={hasDescription ? 'normal' : 'italic'}>
            {hasDescription
              ? extractTranslation(
                  variable.descriptionTranslations,
                  projectLanguage
                )
              : t('noDescription')}
          </Text>
        </VStack>
        <VStack spacing={4} align='left' w='full'>
          <Text fontWeight='bold'>{t('isMandatory')}</Text>
          <Text>
            {variable.isMandatory
              ? t('yes', { ns: 'common' })
              : t('no', { ns: 'common' })}
          </Text>
        </VStack>
        <VStack spacing={4} align='left' w='full'>
          <Card>
            <Box p={4} borderBottom='2px solid' borderBottomColor='pipe'>
              <Text fontWeight='bold' fontSize='lg'>
                {t('noOfDecisionTrees', {
                  count: instanciationNumber,
                })}
              </Text>
            </Box>
            <Accordion allowMultiple>
              {variable.dependenciesByAlgorithm.map(
                (dependencyByAlgorithm: DependenciesByAlgorithm) => (
                  <AccordionItem
                    borderTop='none'
                    key={`dependency_algorithm_${dependencyByAlgorithm.title}`}
                  >
                    <AccordionButton>
                      <Box as='span' flex={1} textAlign='left'>
                        {dependencyByAlgorithm.title}
                      </Box>
                      <AccordionIcon />
                    </AccordionButton>
                    <AccordionPanel
                      pb={4}
                      borderTop='2px solid'
                      borderTopColor='pipe'
                    >
                      <VStack spacing={4}>
                        {dependencyByAlgorithm.dependencies.map(dep => (
                          <HStack
                            key={`dependency_${dep.id}`}
                            w='full'
                            justifyContent='space-between'
                          >
                            <Text noOfLines={1}>{dep.label}</Text>
                            {/* TODO : insert correct instanceableType */}
                            <DiagramButton
                              href={`/projects/${projectId}/diagram/decision-tree/${dep.id}`}
                              isDisabled={dep.type !== 'DecisionTree'}
                            >
                              {t('openDiagram', { ns: 'common' })}
                            </DiagramButton>
                          </HStack>
                        ))}
                      </VStack>
                    </AccordionPanel>
                  </AccordionItem>
                )
              )}
            </Accordion>
          </Card>
        </VStack>
      </VStack>
    )
  }

  return <Spinner size='xl' />
}

export default VariableDetail
