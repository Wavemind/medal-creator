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
} from '@chakra-ui/react'
import { useTranslation } from 'next-i18next'

/**
 * The internal imports
 */
import type { InfoComponent } from '@/types'

const Info: InfoComponent = ({ variable }) => {
  const { t } = useTranslation('variables')

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
          <AccordionItem borderTop='none'>
            <AccordionButton>
              <Box as='span' flex='1' textAlign='left'>
                Section 1 title
              </Box>
              <AccordionIcon />
            </AccordionButton>
            <AccordionPanel pb={4}>
              Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do
              eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut
              enim ad minim veniam, quis nostrud exercitation ullamco laboris
              nisi ut aliquip ex ea commodo consequat.
            </AccordionPanel>
          </AccordionItem>

          <AccordionItem
            borderBottom='none'
            borderTop='2px solid'
            borderTopColor='pipe'
          >
            <AccordionButton>
              <Box as='span' flex='1' textAlign='left'>
                Section 2 title
              </Box>
              <AccordionIcon />
            </AccordionButton>
            <AccordionPanel pb={4}>
              Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do
              eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut
              enim ad minim veniam, quis nostrud exercitation ullamco laboris
              nisi ut aliquip ex ea commodo consequat.
            </AccordionPanel>
          </AccordionItem>
        </Accordion>
      </Box>
    </VStack>
  )
}

export default Info
