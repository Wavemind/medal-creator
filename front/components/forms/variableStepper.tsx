/**
 * The external imports
 */
import { useContext, useMemo, useState } from 'react'
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
import { DrawerContext } from '@/lib/contexts'
import {
  CATEGORIES_DISPLAYING_SYSTEM,
  CATEGORIES_WITHOUT_STAGE,
  EmergencyStatusesEnum,
  HSTORE_LANGUAGES,
  OperatorsEnum,
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
  StringIndexType,
} from '@/types'

const VariableStepper: VariableStepperComponent = ({ projectId }) => {
  const { t } = useTranslation('variables')

  const { isDrawerOpen, closeDrawer } = useContext(DrawerContext)

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
      isSuccess: isCreateVariableSuccess,
      isError: isCreateVariableError,
      error: createVariableError,
      isLoading: isCreateVariableLoading,
    },
  ] = useCreateVariableMutation()

  const AnswerSchema = yup.object().shape({
    label: yup.string().required().label(t('answer.label')),
    value: yup.string().required().label(t('answer.value')),
    operator: yup
      .mixed()
      .oneOf(Object.values(OperatorsEnum))
      .when('answerType', {
        is: (answerType: string) => parseInt(answerType) !== 2,
        then: yup.string().label(t('answer.operator')).required(),
      }),
  })

  // TODO: MAKE THIS WORK
  const methods = useForm<VariableInputs>({
    resolver: yupResolver(
      yup.object({
        answerType: yup.string().label(t('answerType')).required(),
        answersAttributes: yup.array().of(AnswerSchema),
        description: yup.string().label(t('description')),
        isEstimable: yup.boolean().label(t('isEstimable')),
        emergencyStatus: yup
          .mixed()
          .oneOf(Object.values(EmergencyStatusesEnum))
          .label(t('emergencyStatus')),
        formula: yup.string().when('answerType', {
          is: (answerType: string) => parseInt(answerType) === 5,
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
          .label(t('type'))
          .required(),
        isUnavailable: yup.boolean().label(t('isUnavailable.unavailable')), // CONDITIONAL LABEL DISPLAY
      })
    ),
    reValidateMode: 'onSubmit',
    defaultValues: {
      answerType: undefined,
      answersAttributes: [],
      description: '',
      emergencyStatus: EmergencyStatusesEnum.Standard,
      formula: undefined,
      isEstimable: false,
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
      projectId: String(projectId),
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
    const tmpData = structuredClone(data)
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

    tmpData.answersAttributes.forEach(answerAttribute => {
      answerAttribute.labelTranslations = {}
      HSTORE_LANGUAGES.forEach(language => {
        answerAttribute.labelTranslations[language] =
          language === project?.language.code && answerAttribute.label
            ? answerAttribute.label
            : ''
      })
      delete answerAttribute.label
    })

    delete tmpData.label
    delete tmpData.description
    delete tmpData.maxMessageError
    delete tmpData.minMessageError
    delete tmpData.minMessageWarning
    delete tmpData.maxMessageWarning
    delete tmpData.placeholder
    console.log({
      projectId,
      labelTranslations,
      descriptionTranslations,
      maxMessageErrorTranslations,
      minMessageErrorTranslations,
      minMessageWarningTranslations,
      maxMessageWarningTranslations,
      placeholderTranslations,
      filesToAdd,
      ...tmpData,
    })
    createVariable({
      projectId,
      labelTranslations,
      descriptionTranslations,
      maxMessageErrorTranslations,
      minMessageErrorTranslations,
      minMessageWarningTranslations,
      maxMessageWarningTranslations,
      placeholderTranslations,
      filesToAdd,
      ...tmpData,
    })
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
        break
      }
      case 1: {
        isValid = await methods.trigger(['answersAttributes'])
        break
      }
    }

    if (isValid) {
      if (isDrawerOpen) {
        closeDrawer()
      }
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
          content: <AnswerForm projectId={projectId} />,
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

  if (isAnswerTypeSuccess && isProjectSuccess) {
    return (
      <Flex flexDir='column' width='100%'>
        <FormProvider<VariableInputs>
          methods={methods}
          isError={isCreateVariableError}
          error={createVariableError}
        >
          <form onSubmit={methods.handleSubmit(onSubmit)}>
            <Steps variant='circles-alt' activeStep={activeStep}>
              {steps.map(({ label, content }) => (
                <Step label={label} key={label}>
                  <VStack alignItems='flex-start' spacing={8} mt={8}>
                    <Box w='full'>{content}</Box>
                    <Flex gap={2}>
                      {activeStep !== 0 && (
                        <Button
                          onClick={prevStep}
                          disabled={isCreateVariableLoading}
                        >
                          {t('previous', { ns: 'common' })}
                        </Button>
                      )}
                      {activeStep !== 2 && (
                        <Button onClick={handleNext}>
                          {t('next', { ns: 'common' })}
                        </Button>
                      )}
                      {activeStep === 2 && (
                        <Button
                          type='submit'
                          data-cy='submit'
                          disabled={isCreateVariableLoading}
                        >
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
