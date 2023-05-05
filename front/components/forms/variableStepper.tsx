/**
 * The external imports
 */
import { useEffect, useState } from 'react'
import { Step, Steps, useSteps } from 'chakra-ui-steps'
import {
  Flex,
  VStack,
  Box,
  Text,
  Heading,
  Button,
  Spinner,
} from '@chakra-ui/react'
import { useTranslation } from 'next-i18next'
import { yupResolver } from '@hookform/resolvers/yup'
import * as yup from 'yup'
import { useForm } from 'react-hook-form'

/**
 * The internal imports
 */
import { VariableForm, FormProvider } from '@/components'
import {
  CATEGORIES_DISPLAYING_SYSTEM,
  EmergencyStatusesEnum,
  RoundsEnum,
  VariableTypesEnum,
} from '@/lib/config/constants'
import { useGetAnswerTypesQuery } from '@/lib/api/modules'
import type { VariableStepperComponent, StepperSteps } from '@/types'

const VariableStepper: VariableStepperComponent = ({ projectId }) => {
  const { t } = useTranslation('variables')

  const { data: answerTypes, isSuccess } = useGetAnswerTypesQuery()

  // TODO: MAKE THIS WORK
  const methods = useForm({
    resolver: yupResolver(
      yup.object({
        answerType: yup.string().label(t('answerType')).required(),
        description: yup.string().label(t('description')),
        estimable: yup.boolean().label(t('estimable')),
        emergencyStatus: yup
          .mixed()
          .oneOf(Object.values(EmergencyStatusesEnum))
          .label(t('emergencyStatus')),
        formula: yup.string().when('answerType', {
          is: answerType => answerType === 5,
          then: yup.string().label(t('formula')).required(),
        }),
        isMandatory: yup.boolean().label(t('isMandatory')),
        isIdentifiable: yup.boolean().label(t('isIdentifiable')),
        isPrefill: yup.boolean().label(t('isPrefill')),
        isNeonat: yup.boolean().label(t('isNeonat')),
        label: yup.string().label(t('label')).required(),
        maxMessageError: yup.string().label(t('maxMessageError')),
        maxMessageWarning: yup.string().label(t('maxMessageWarning')),
        maxValueError: yup.number().label(t('maxValueError')),
        maxValueWarning: yup.number().label(t('maxValueWarning')),
        minValueError: yup.number().label(t('minValueError')),
        minValueWarning: yup.number().label(t('minValueWarning')),
        minMessageError: yup.string().label(t('minMessageError')),
        minMessageWarning: yup.string().label(t('minMessageWarning')),
        round: yup.mixed().oneOf(Object.values(RoundsEnum)).label(t('round')),
        system: yup.string().when('type', {
          is: type => CATEGORIES_DISPLAYING_SYSTEM.includes(type),
          then: yup.string().label(t('system')).required(),
        }),
        type: yup
          .mixed()
          .oneOf(Object.values(VariableTypesEnum))
          .label(t('type')),
        unavailable: yup.boolean().label(t('unavailable.unavailable')), // CONDITIONAL LABEL DISPLAY
      })
    ),
    reValidateMode: 'onSubmit',
    defaultValues: {
      answerType: undefined,
      description: '',
      estimable: false,
      emergencyStatus: undefined,
      formula: undefined,
      isMandatory: false,
      isIdentifiable: false,
      isPrefill: false,
      isNeonat: false,
      label: '',
      maxMessageError: undefined,
      maxMessageWarning: undefined,
      maxValueError: undefined,
      maxValueWarning: undefined,
      minValueError: undefined,
      minValueWarning: undefined,
      minMessageError: undefined,
      minMessageWarning: undefined,
      round: undefined,
      system: undefined,
      type: undefined,
      unavailable: false,
    },
  })

  const { nextStep, activeStep, prevStep } = useSteps({
    initialStep: 0,
  })

  const onSubmit = (data: UserInputs) => {
    console.log('coucou')
  }

  const handleNext = async () => {
    let isValid = false
    switch (activeStep) {
      case 0: {
        isValid = await methods.trigger([
          'answerType',
          'description',
          'estimable',
          'emergencyStatus',
          'formula',
          'isMandatory',
          'isIdentifiable',
          'isPrefill',
          'isNeonat',
          'label',
          'maxMessageError',
          'maxMessageWarning',
          'maxValueError',
          'maxValueWarning',
          'minValueError',
          'minValueWarning',
          'minMessageError',
          'minMessageWarning',
          'round',
          'system',
          'type',
          'unavailable',
        ])
      }
    }

    if (isValid) {
      nextStep()
    }
  }

  const steps: StepperSteps[] = [
    {
      label: t('stepper.variable'),
      content: (
        <VariableForm projectId={projectId} answerTypes={answerTypes!} />
      ),
    },
    {
      label: t('stepper.answers'),
      content: <Heading>Coucou</Heading>,
    },
    {
      label: t('stepper.medias'),
      content: <Heading>MEDIAS</Heading>,
    },
  ]

  if (isSuccess) {
    return (
      <Flex flexDir='column' width='100%'>
        <FormProvider methods={methods} isError={false} error={{}}>
          <form onSubmit={methods.handleSubmit(onSubmit)}>
            <Steps variant='circles-alt' activeStep={activeStep}>
              {steps.map(({ label, content }) => (
                <Step label={label} key={label}>
                  <VStack alignItems='flex-start' spacing={8} mt={8}>
                    <Box w='full'>{content}</Box>
                    <Flex gap={2}>
                      {activeStep !== 0 && (
                        <Button onClick={prevStep}>
                          {t('previous', { ns: 'common' })}
                        </Button>
                      )}
                      {activeStep !== 2 && (
                        <Button onClick={handleNext}>
                          {t('next', { ns: 'common' })}
                        </Button>
                      )}
                      {activeStep === 2 && (
                        <Button type='submit' data-cy='submit'>
                          {t('save', { ns: 'common' })}
                        </Button>
                      )}
                    </Flex>
                  </VStack>
                </Step>
              ))}
            </Steps>
          </form>
        </FormProvider>
      </Flex>
    )
  }

  return <Spinner />
}

export default VariableStepper
