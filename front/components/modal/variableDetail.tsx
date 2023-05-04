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
  Button,
  HStack,
  Spinner,
  Heading,
} from '@chakra-ui/react'
import { useTranslation } from 'next-i18next'
import { useRouter } from 'next/router'

/**
 * The internal imports
 */
import { useGetProjectQuery, useGetVariableQuery } from '@/lib/api/modules'
import type { VariableDetailComponent } from '@/types'

const VariableDetail: VariableDetailComponent = ({ id }) => {
  const { t } = useTranslation('variables')
  const {
    query: { projectId },
  } = useRouter()

  const { data: variable, isSuccess: isSuccessVariable } =
    useGetVariableQuery(id)
  const { data: project, isSuccess: isSuccessProj } = useGetProjectQuery(
    Number(projectId)
  )

  /**
   * Designates whether a description exists for the variable
   */
  const hasDescription = useMemo(() => {
    if (variable && project) {
      return !!variable.descriptionTranslations[project.language.code]
    }
    return false
  }, [variable, project])

  /**
   * Calculate number of instanciated variable
   */
  const instanciationNumber = useMemo(() => {
    if (isSuccessVariable) {
      return variable.dependenciesByAlgorithm
        .map(dep => dep.dependencies.length)
        .reduce((sum, a) => sum + a, 0)
    }

    return 0
  }, [variable])

  const openDiagram = (id: number, type: string): void => {
    console.log('TODO : Open the decision tree', id, type)
  }

  if (isSuccessVariable && isSuccessProj) {
    return (
      <VStack spacing={10} align='left' w='full'>
        <Heading textAlign='center'>
          {variable.labelTranslations[project.language.code]}
        </Heading>
        <VStack spacing={4} align='left' w='full'>
          <Text fontWeight='bold'>{t('description')}</Text>
          <Text fontStyle={hasDescription ? 'normal' : 'italic'}>
            {hasDescription
              ? variable.descriptionTranslations[project.language.code]
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
          <Box
            boxShadow='0px 0px 4px rgba(0, 0, 0, 0.15)'
            borderRadius='lg'
            w='full'
          >
            <Box p={4} borderBottom='2px solid' borderBottomColor='pipe'>
              <Text fontWeight='bold' fontSize='lg'>
                {t('noOfDecisionTrees', {
                  count: instanciationNumber,
                })}
              </Text>
            </Box>
            <Accordion allowMultiple>
              {variable.dependenciesByAlgorithm.map(dependencyByAlgorithm => (
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
                          <Button onClick={() => openDiagram(dep.id, dep.type)}>
                            {t('openDiagram', { ns: 'common' })}
                          </Button>
                        </HStack>
                      ))}
                    </VStack>
                  </AccordionPanel>
                </AccordionItem>
              ))}
            </Accordion>
          </Box>
        </VStack>
      </VStack>
    )
  }

  return <Spinner size='xl' />
}

export default VariableDetail
