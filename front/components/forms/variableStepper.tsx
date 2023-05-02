/**
 * The external imports
 */
import { useState } from 'react'
import { Step, Steps, useSteps } from 'chakra-ui-steps'
import { Flex, VStack, Box, Text, Heading } from '@chakra-ui/react'
import { useTranslation } from 'next-i18next'

/**
 * The internal imports
 */
import { VariableForm } from '..'
import type { VariableStepperComponent, StepperSteps } from '@/types'

const VariableStepper: VariableStepperComponent = ({ projectId }) => {
  const { t } = useTranslation('variables')

  const { nextStep, activeStep, prevStep } = useSteps({
    initialStep: 0,
  })

  const [variableId, setVariableId] = useState<number | undefined>(undefined)

  const steps: StepperSteps[] = [
    {
      label: t('stepper.variable'),
      content: (
        <VariableForm
          projectId={projectId}
          nextStep={nextStep}
          setVariableId={setVariableId}
        />
      ),
    },
    {
      label: t('stepper.answers'),
      content: variableId ? (
        <Heading>Coucou</Heading>
      ) : (
        <Text>{t('errorBoundary.generalError', { ns: 'common' })}</Text>
      ),
    },
    {
      label: t('stepper.medias'),
      content: variableId ? (
        <Heading>Coucou</Heading>
      ) : (
        <Text>{t('errorBoundary.generalError', { ns: 'common' })}</Text>
      ),
    },
  ]

  return (
    <Flex flexDir='column' width='100%'>
      <Steps variant='circles-alt' activeStep={activeStep}>
        {steps.map(({ label, content }) => (
          <Step label={label} key={label}>
            <VStack alignItems='flex-start' spacing={8} mt={8}>
              <Box w='full'>{content}</Box>
            </VStack>
          </Step>
        ))}
      </Steps>
    </Flex>
  )
}

export default VariableStepper
