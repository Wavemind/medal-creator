/**
 * The external imports
 */
import { useTranslation } from 'next-i18next'
import { Step, Steps, useSteps } from 'chakra-ui-steps'
import { Flex, Button, Text } from '@chakra-ui/react'

/**
 * The internal imports
 */
import DecisionTreeForm from './decisionTree'
const content = (
  <Flex py={4}>
    <Text>Content</Text>
  </Flex>
)

const DecisionTreeStepper = ({ algorithmId, projectId }) => {
  const { t } = useTranslation('decisionTrees')

  const { nextStep, setStep, reset, activeStep } = useSteps({
    initialStep: 0,
  })

  const steps = [
    {
      label: 'New decision tree',
      content: <DecisionTreeForm projectId={projectId} nextStep={nextStep} />,
    },
    { label: 'New diagnosis', content },
    { label: 'Summary', content },
  ]

  return (
    <Flex flexDir='column' width='100%'>
      <Steps variant='circles-alt' activeStep={activeStep}>
        {steps.map(({ label, content }) => (
          <Step label={label} key={label}>
            {content}
          </Step>
        ))}
      </Steps>
    </Flex>
  )
}

export default DecisionTreeStepper
