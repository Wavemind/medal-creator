/**
 * The external imports
 */
import { useMemo, useState } from 'react'
import { Step, Steps, useSteps } from 'chakra-ui-steps'
import {
  Flex,
  VStack,
  Box,
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
import { VariableForm, MediaForm, FormProvider } from '@/components'
import {
  CATEGORIES_DISPLAYING_SYSTEM,
  CATEGORIES_WITHOUT_STAGE,
  EmergencyStatusesEnum,
  RoundsEnum,
  VariableTypesEnum,
} from '@/lib/config/constants'
import { useGetAnswerTypesQuery } from '@/lib/api/modules'
import type {
  VariableStepperComponent,
  StepperSteps,
  VariableInputs,
} from '@/types'

const VariableStepper: VariableStepperComponent = ({ projectId }) => {
  const { t } = useTranslation('variables')

  const [filesToAdd, setFilesToAdd] = useState<File[]>([])
  const [existingFilesToRemove, setExistingFilesToRemove] = useState<number[]>(
    []
  )

  // Check if here or in variable.ts
  const { data: answerTypes, isSuccess } = useGetAnswerTypesQuery()

  // TODO: MAKE THIS WORK
  const methods = useForm<VariableInputs>({
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
          is: (answerType: number) => answerType === 5,
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
        placeholder: yup.string().label(t('placeholder')),
        round: yup.mixed().oneOf(Object.values(RoundsEnum)).label(t('round')),
        system: yup.string().when('type', {
          is: (type: VariableTypesEnum) =>
            CATEGORIES_DISPLAYING_SYSTEM.includes(type),
          then: yup.string().label(t('system')).required(),
        }),
        stage: yup.string().when('type', {
          is: (type: VariableTypesEnum) =>
            !CATEGORIES_WITHOUT_STAGE.includes(type),
          then: yup.string().label(t('stage')).required(),
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
      emergencyStatus: EmergencyStatusesEnum.Standard,
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
      stage: undefined,
      system: undefined,
      type: undefined,
      unavailable: false,
    },
  })

  const { nextStep, activeStep, prevStep } = useSteps({
    initialStep: 0,
  })

  const onSubmit = (data: VariableInputs) => {
    console.log('coucou', data)
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

  const steps: StepperSteps[] = useMemo(() => {
    if (answerTypes) {
      return [
        {
          label: t('stepper.variable'),
          content: (
            <VariableForm projectId={projectId} answerTypes={answerTypes} />
          ),
        },
        {
          label: t('stepper.answers'),
          content: <Heading>Coucou</Heading>,
        },
        {
          label: t('stepper.medias'),
          content: (
            <MediaForm
              filesToAdd={filesToAdd}
              setFilesToAdd={setFilesToAdd}
              existingFilesToRemove={existingFilesToRemove}
              setExistingFilesToRemove={setExistingFilesToRemove}
            />
          ),
        },
      ]
    }
    return []
  }, [answerTypes])

  if (isSuccess) {
    return (
      <Flex flexDir='column' width='100%'>
        <FormProvider<VariableInputs> methods={methods} isError={false} error={{}}>
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
