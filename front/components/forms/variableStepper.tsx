/**
 * The external imports
 */
import { useEffect, useMemo, useState } from 'react'
import { Step, Steps, useSteps } from 'chakra-ui-steps'
import { Flex, VStack, Box, Button, Spinner } from '@chakra-ui/react'
import { useTranslation } from 'next-i18next'
import { yupResolver } from '@hookform/resolvers/yup'
import { useForm } from 'react-hook-form'

/**
 * The internal imports
 */
import {
  VariableForm,
  AnswersForm,
  MediaForm,
  FormProvider,
} from '@/components'
import {
  CATEGORIES_WITHOUT_ANSWERS,
  EmergencyStatusesEnum,
  HSTORE_LANGUAGES,
  NO_ANSWERS_ATTACHED_ANSWER_TYPE,
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
import { VariableService } from '@/lib/services'

const VariableStepper: VariableStepperComponent = ({ projectId }) => {
  const { t } = useTranslation('variables')

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

  // TODO: MAKE THIS WORK
  const methods = useForm<VariableInputs>({
    resolver: yupResolver(VariableService.getValidationSchema(t)),
    reValidateMode: 'onSubmit',
    defaultValues: {
      answerType: '',
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

  const { nextStep, activeStep, prevStep, setStep } = useSteps({
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

  const handlePrevious = () => {
    if (
      NO_ANSWERS_ATTACHED_ANSWER_TYPE.includes(
        parseInt(methods.getValues('answerType'))
      ) ||
      (CATEGORIES_WITHOUT_ANSWERS.includes(methods.getValues('type')) &&
        !methods.getValues('isUnavailable'))
    ) {
      setStep(0)
    } else {
      prevStep()
    }
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
        console.log(methods.formState.errors)
        isValid = await methods.trigger(['answersAttributes'])
        break
      }
    }

    // Skip answers form if the question type doesn't have any OR if the answers are automatically generated (boolean) or if it is edit mode and the question is already used
    // TODO ADD updateMode && (is_used || is_deployed)
    if (
      (isValid &&
        activeStep === 0 &&
        NO_ANSWERS_ATTACHED_ANSWER_TYPE.includes(
          parseInt(methods.getValues('answerType'))
        )) ||
      (CATEGORIES_WITHOUT_ANSWERS.includes(methods.getValues('type')) &&
        !methods.getValues('isUnavailable'))
    ) {
      setStep(2)
    } else if (isValid) {
      nextStep()
    }
  }

  const steps: StepperSteps[] = useMemo(() => {
    if (answerTypes) {
      return [
        {
          label: t('stepper.variable.title'),
          content: (
            <VariableForm projectId={projectId} answerTypes={answerTypes} />
          ),
        },
        {
          label: t('stepper.answers.title'),
          content: <AnswersForm projectId={projectId} />,
          description: t('stepper.answers.description'),
        },
        {
          label: t('stepper.medias.title'),
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
              {steps.map(({ label, content, description }) => (
                <Step label={label} key={label} description={description}>
                  <VStack alignItems='flex-start' spacing={8} mt={8}>
                    <Box w='full'>{content}</Box>
                    <Flex gap={2}>
                      {activeStep !== 0 && (
                        <Button
                          onClick={handlePrevious}
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
