/**
 * The external imports
 */
import { useTranslation } from 'next-i18next'
import { Step, Steps, useSteps, Flex, Button, Text } from 'chakra-ui-steps'

/**
 * The internal imports
 */
const content = (
  <Flex py={4}>
    <Text>Content</Text>
  </Flex>
)

const steps = [
  { label: 'Step 1', content },
  { label: 'Step 2', content },
  { label: 'Step 3', content },
]

const DecisionTreeStepper = () => {
  const { t } = useTranslation('decisionTrees')

  const { nextStep, prevStep, setStep, reset, activeStep } = useSteps({
    initialStep: 0,
  })

  return (
    <Flex flexDir='column' width='100%'>
      <Steps activeStep={activeStep}>
        {steps.map(({ label, content }) => (
          <Step label={label} key={label}>
            {content}
          </Step>
        ))}
      </Steps>
      {activeStep === steps.length ? (
        <Flex p={4}>
          <Button mx='auto' size='sm' onClick={reset}>
            Reset
          </Button>
        </Flex>
      ) : (
        <Flex width='100%' justify='flex-end'>
          <Button
            isDisabled={activeStep === 0}
            mr={4}
            onClick={prevStep}
            size='sm'
            variant='ghost'
          >
            Prev
          </Button>
          <Button size='sm' onClick={nextStep}>
            {activeStep === steps.length - 1 ? 'Finish' : 'Next'}
          </Button>
        </Flex>
      )}
    </Flex>
  )
}

export default DecisionTreeStepper
