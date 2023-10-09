/**
 * The external imports
 */
import { useState } from 'react'
import {
  Flex,
  VStack,
  Box,
  Text,
  Stepper,
  Step,
  StepIcon,
  StepIndicator,
  StepNumber,
  StepSeparator,
  StepStatus,
  StepTitle,
  useSteps,
} from '@chakra-ui/react'
import { useTranslation } from 'next-i18next'

/**
 * The internal imports
 */
import DecisionTreeForm from '@/components/forms/decisionTree'
import DiagnosisForm from '@/components/forms/diagnosis'
import DecisionTreeSummary from '@/components/forms/decisionTreeSummary'
import type { DecisionTreeStepperComponent, StepperSteps } from '@/types'

const DecisionTreeStepper: DecisionTreeStepperComponent = ({
  algorithmId,
  projectId,
}) => {
  const { t } = useTranslation('decisionTrees')

  const [decisionTreeId, setDecisionTreeId] = useState<undefined | string>(
    undefined
  )
  const [diagnosisId, setDiagnosisId] = useState<undefined | string>(undefined)

  const { goToNext, goToPrevious, activeStep } = useSteps({
    index: 0,
    count: 3,
  })

  const steps: StepperSteps[] = [
    {
      title: t('new'),
      content: (
        <DecisionTreeForm
          projectId={projectId}
          algorithmId={algorithmId}
          nextStep={goToNext}
          setDecisionTreeId={setDecisionTreeId}
        />
      ),
    },
    {
      title: t('addDiagnosis', { ns: 'datatable' }),
      content: decisionTreeId ? (
        <DiagnosisForm
          projectId={projectId}
          decisionTreeId={decisionTreeId}
          diagnosisId={diagnosisId}
          setDiagnosisId={setDiagnosisId}
          nextStep={goToNext}
        />
      ) : (
        <Text>{t('errorBoundary.generalError', { ns: 'common' })}</Text>
      ),
    },
    {
      title: t('summary'),
      content: decisionTreeId ? (
        <DecisionTreeSummary
          projectId={projectId}
          algorithmId={algorithmId}
          decisionTreeId={decisionTreeId}
          setDiagnosisId={setDiagnosisId}
          prevStep={goToPrevious}
        />
      ) : (
        <Text>{t('errorBoundary.generalError', { ns: 'common' })}</Text>
      ),
    },
  ]

  return (
    <Flex flexDir='column'>
      <Stepper index={activeStep}>
        {steps.map(({ title }) => (
          <Step key={title}>
            <VStack>
              <StepIndicator>
                <StepStatus
                  complete={<StepIcon />}
                  incomplete={<StepNumber />}
                  active={<StepNumber />}
                />
              </StepIndicator>
              <Box flexShrink='0'>
                <StepTitle>{title}</StepTitle>
              </Box>
            </VStack>
            <StepSeparator />
          </Step>
        ))}
      </Stepper>
      <VStack spacing={8} mt={8}>
        <Box w='full'>{steps[activeStep].content}</Box>
      </VStack>
    </Flex>
  )
}

export default DecisionTreeStepper
