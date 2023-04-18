/**
 * The external imports
 */
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
} from '@chakra-ui/react'
import { useTranslation } from 'next-i18next'

/**
 * The internal imports
 */
import type { InfoComponent } from '@/types'

const Info: InfoComponent = ({ variable }) => {
  const { t } = useTranslation('variables')

  const openDiagram = (id: number, type: string): void => {
    console.log('TODO : Open the decision tree', id, type)
  }

  return (
    <VStack alignItems='flex-start' spacing={6}>
      <Text fontSize='sm'>{t('description')}</Text>
      {variable.descriptionTranslations.en ? (
        <Text>{variable.descriptionTranslations.en}</Text>
      ) : (
        <Text fontStyle='italic'>{t('noDescription')}</Text>
      )}
      <Text fontSize='sm'>{t('isMandatory')}</Text>
      <Text>{variable.isMandatory ? t('yes') : t('no')}</Text>
      <Text fontSize='sm'>{t('decisionTrees')}</Text>
      <Box
        boxShadow='0px 0px 4px rgba(0, 0, 0, 0.15)'
        borderRadius='lg'
        w='full'
      >
        <Box p={4} borderBottom='2px solid' borderBottomColor='pipe'>
          <Text fontWeight='bold' fontSize='lg'>
            {t('noOfDecisionTrees', { value: 8 })}
          </Text>
        </Box>
        <Accordion allowMultiple>
          {Object.values(variable.dependencies).map(dependency => (
            <AccordionItem
              borderTop='none'
              key={`dependency_algorithm_${dependency.title}`}
            >
              <AccordionButton>
                <Box as='span' flex='1' textAlign='left'>
                  {dependency.title}
                </Box>
                <AccordionIcon />
              </AccordionButton>
              <AccordionPanel
                pb={4}
                borderTop='2px solid'
                borderTopColor='pipe'
              >
                <VStack spacing={4}>
                  {dependency.dependencies.map(dep => (
                    <HStack
                      key={`dependency_${dep.id}`}
                      w='full'
                      pl={8}
                      justifyContent='space-between'
                    >
                      <Text>{dep.label}</Text>
                      <Button onClick={() => openDiagram(dep.id, dep.type)}>
                        Open diagram
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
  )
}

export default Info
