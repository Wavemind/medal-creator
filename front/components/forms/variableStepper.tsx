/**
 * The external imports
 */
import { useMemo, useState } from 'react'
import { Step, Steps, useSteps } from 'chakra-ui-steps'
import { Flex, VStack, Box, Button, Spinner } from '@chakra-ui/react'
import { useTranslation } from 'next-i18next'
import { yupResolver } from '@hookform/resolvers/yup'
import * as yup from 'yup'
import { useForm } from 'react-hook-form'

/**
 * The internal imports
 */
import { VariableForm, AnswerForm, MediaForm, FormProvider } from '@/components'
import {
  ANSWER_TEMPLATE,
  CATEGORIES_DISPLAYING_SYSTEM,
  CATEGORIES_WITHOUT_STAGE,
  EmergencyStatusesEnum,
  HSTORE_LANGUAGES,
  RoundsEnum,
  VariableTypesEnum,
} from '@/lib/config/constants'
import {
  useGetAnswerTypesQuery,
  useCreateVariableMutation,
  useGetProjectQuery,
} from '@/lib/api/modules'
import type {
  VariableStepperComponent,
  StepperSteps,
  VariableInputs,
  AnswerTemplate,
  StringIndexType,
} from '@/types'

const VariableStepper: VariableStepperComponent = ({ projectId }) => {
  const { t } = useTranslation('variables')

  const [answers, setAnswers] = useState<AnswerTemplate[]>([ANSWER_TEMPLATE])
  const [filesToAdd, setFilesToAdd] = useState<File[]>([])
  const [existingFilesToRemove, setExistingFilesToRemove] = useState<number[]>(
    []
  )

  // Check if here or in variable.ts
  const { data: answerTypes, isSuccess: isAnswerTypeSuccess } =
    useGetAnswerTypesQuery()

  const { data: project, isSuccess: isProjectSuccess } =
    useGetProjectQuery(projectId)

  const [
    createVariable,
    {
      data: newVariable,
      isSuccess: isCreateVariableSuccess,
      isError: isCreateVariableError,
      error: createVariableError,
      isLoading: isCreateVariableLoading,
    },
  ] = useCreateVariableMutation()

  // TODO: MAKE THIS WORK
  const methods = useForm<VariableInputs>({
    resolver: yupResolver(
      yup.object({
        answerType: yup.string().label(t('answerType')).required(),
        description: yup.string().label(t('description')),
        isEstimable: yup.boolean().label(t('isEstimable')),
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
        isPreFill: yup.boolean().label(t('isPreFill')),
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
        isUnavailable: yup.boolean().label(t('isUnavailable.unavailable')), // CONDITIONAL LABEL DISPLAY
      })
    ),
    reValidateMode: 'onSubmit',
    defaultValues: {
      answerType: undefined,
      description: '',
      isEstimable: false,
      emergencyStatus: EmergencyStatusesEnum.Standard,
      formula: undefined,
      isMandatory: false,
      isIdentifiable: false,
      isPreFill: false,
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
      isUnavailable: false,
    },
  })

  const { nextStep, activeStep, prevStep } = useSteps({
    initialStep: 0,
  })

  const onSubmit = (data: VariableInputs) => {
    const tmpData = { ...data }
    const labelTranslations: StringIndexType = {}
    const descriptionTranslations: StringIndexType = {}
    const maxMessageErrorTranslations: StringIndexType = {}
    const minMessageErrorTranslations: StringIndexType = {}
    const minMessageWarningTranslations: StringIndexType = {}
    const maxMessageWarningTranslations: StringIndexType = {}
    const placeholderTranslations: StringIndexType = {}
    HSTORE_LANGUAGES.forEach(language => {
      labelTranslations[language] =
        language === project?.language.code && tmpData.label
          ? tmpData.label
          : ''
      descriptionTranslations[language] =
        language === project?.language.code && tmpData.description
          ? tmpData.description
          : ''

      maxMessageErrorTranslations[language] =
        language === project?.language.code && tmpData.maxMessageError
          ? tmpData.maxMessageError
          : ''
      minMessageErrorTranslations[language] =
        language === project?.language.code && tmpData.minMessageError
          ? tmpData.minMessageError
          : ''
      minMessageWarningTranslations[language] =
        language === project?.language.code && tmpData.minMessageWarning
          ? tmpData.minMessageWarning
          : ''
      maxMessageWarningTranslations[language] =
        language === project?.language.code && tmpData.maxMessageWarning
          ? tmpData.maxMessageWarning
          : ''
      placeholderTranslations[language] =
        language === project?.language.code && tmpData.placeholder
          ? tmpData.placeholder
          : ''
    })
    delete tmpData.label
    delete tmpData.description
    delete tmpData.maxMessageError
    delete tmpData.minMessageError
    delete tmpData.minMessageWarning
    delete tmpData.maxMessageWarning
    delete tmpData.placeholder

    createVariable(tmpData)
  }

  const handleNext = async () => {
    let isValid = false
    switch (activeStep) {
      case 0: {
        isValid = await methods.trigger([
          'answerType',
          'description',
          'isEstimable',
          'emergencyStatus',
          'formula',
          'isMandatory',
          'isIdentifiable',
          'isPreFill',
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
          'isUnavailable',
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
          content: <AnswerForm answers={answers} setAnswers={setAnswers} />,
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
  }, [answerTypes, answers])

  if (isAnswerTypeSuccess && isProjectSuccess) {
    return (
      <Flex flexDir='column' width='100%'>
        <FormProvider<VariableInputs>
          methods={methods}
          isError={false}
          error={{}}
        >
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
