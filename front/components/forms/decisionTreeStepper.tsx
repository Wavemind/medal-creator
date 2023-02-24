/**
 * The external imports
 */
import { useState, FC } from 'react'
import { Step, Steps, useSteps } from 'chakra-ui-steps'
import { Flex, VStack, Box, Text } from '@chakra-ui/react'
import { useTranslation } from 'next-i18next'
import type { DefaultTFuncReturn } from 'i18next'

/**
 * The internal imports
 */
import { DecisionTreeForm, DiagnosisForm, DecisionTreeSummary } from '..'

/**
 * Type definitions
 */
type DecisionTreeStepperProps = {
  algorithmId: number
  projectId: number
}

type Steps = {
  label: DefaultTFuncReturn
  content: JSX.Element
}

const DecisionTreeStepper: FC<DecisionTreeStepperProps> = ({
  algorithmId,
  projectId,
}) => {
  const { t } = useTranslation('decisionTrees')

  const { nextStep, activeStep, prevStep } = useSteps({
    initialStep: 0,
  })

  const [decisionTreeId, setDecisionTreeId] = useState<undefined | number>(
    undefined
  )
  const [diagnosisId, setDiagnosisId] = useState<undefined | number>(undefined)

  const steps: Steps[] = [
    {
      label: t('new'),
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
      label: t('newDiagnosis', { ns: 'datatable' }),
      content: decisionTreeId ? (
        <DiagnosisForm
          projectId={projectId}
          decisionTreeId={decisionTreeId}
          diagnosisId={diagnosisId}
          setDiagnosisId={setDiagnosisId}
          nextStep={nextStep}
        />
      ) : (
        <Text>An error occured</Text>
      ),
    },
    {
      label: t('summary'),
      content: decisionTreeId ? (
        <DecisionTreeSummary
          projectId={projectId}
          algorithmId={algorithmId}
          decisionTreeId={decisionTreeId}
          setDiagnosisId={setDiagnosisId}
          prevStep={prevStep}
        />
      ) : (
        <Text>An error occured</Text>
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
