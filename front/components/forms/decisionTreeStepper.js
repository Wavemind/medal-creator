/**
 * The external imports
 */
import { useState } from 'react'
import { Step, Steps, useSteps } from 'chakra-ui-steps'
import { Flex, Text, VStack, Box } from '@chakra-ui/react'

/**
 * The internal imports
 */
import { DecisionTreeForm, DiagnosisForm } from '../'

const content = (
  <Flex py={4}>
    <Text>Content</Text>
  </Flex>
)

const DecisionTreeStepper = ({ algorithmId, projectId }) => {
  const { nextStep, activeStep } = useSteps({
    initialStep: 0,
  })

  const [decisionTreeId, setDecisionTreeId] = useState(1)

  const steps = [
    {
      label: 'New decision tree',
      instructions: 'Decision tree details',
      content: (
        <DecisionTreeForm
          projectId={projectId}
          algorithmId={algorithmId}
          nextStep={nextStep}
          setDecisionTreeId={setDecisionTreeId}
        />
      ),
    },
    {
      label: 'New diagnosis',
      instructions: 'Add diagnosis you would like to establish',
      content: (
        <DiagnosisForm
          projectId={projectId}
          decisionTreeId={decisionTreeId}
          nextStep={nextStep}
        />
      ),
    },
    { label: 'Summary', instructions: 'Add other diagnoses', content },
  ]

  return (
    <Flex flexDir='column' width='100%'>
      <Steps variant='circles-alt' activeStep={activeStep}>
        {steps.map(({ label, instructions, content }) => (
          <Step label={label} key={label}>
            <VStack alignItems='flex-start' spacing={8} mt={8}>
              <Text>{instructions}</Text>
              <Box w='full'>{content}</Box>
            </VStack>
          </Step>
        ))}
      </Steps>
    </Flex>
  )
}

export default DecisionTreeStepper
