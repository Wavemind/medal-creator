/**
 * The external imports
 */
import { useState } from 'react'
import { Step, Steps, useSteps } from 'chakra-ui-steps'
import { Flex, VStack, Box } from '@chakra-ui/react'

/**
 * The internal imports
 */
import { DecisionTreeForm, DiagnosisForm, DecisionTreeSummary } from '../'

const DecisionTreeStepper = ({ algorithmId, projectId }) => {
  const { nextStep, activeStep, prevStep } = useSteps({
    initialStep: 0,
  })

  const [decisionTreeId, setDecisionTreeId] = useState(null)
  const [diagnosisId, setDiagnosisId] = useState(null)

  const steps = [
    {
      label: 'New decision tree',
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
      content: (
        <DiagnosisForm
          projectId={projectId}
          decisionTreeId={decisionTreeId}
          diagnosisId={diagnosisId}
          setDiagnosisId={setDiagnosisId}
          nextStep={nextStep}
        />
      ),
    },
    {
      label: 'Summary',
      content: (
        <DecisionTreeSummary
          projectId={projectId}
          algorithmId={algorithmId}
          decisionTreeId={decisionTreeId}
          setDiagnosisId={setDiagnosisId}
          prevStep={prevStep}
        />
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

export default DecisionTreeStepper
