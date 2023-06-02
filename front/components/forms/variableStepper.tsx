/**
 * The external imports
 */
import React, { useContext, useEffect, useMemo, useState } from 'react'
import { Step, Steps, useSteps } from 'chakra-ui-steps'
import { Flex, VStack, Box, Button, Spinner } from '@chakra-ui/react'
import { useTranslation } from 'next-i18next'
import { yupResolver } from '@hookform/resolvers/yup'
import { useFieldArray, useForm } from 'react-hook-form'

/**
 * The internal imports
 */
import {
  VariableForm,
  AnswersForm,
  MediaForm,
  FormProvider,
  ErrorMessage,
} from '@/components'
import { DrawerContext } from '@/lib/contexts'
import { VariableService } from '@/lib/services'
import {
  ANSWER_TYPE_WITHOUT_OPERATOR_AND_ANSWER,
  CATEGORIES_WITHOUT_ANSWERS,
  CATEGORIES_WITHOUT_OPERATOR,
  EmergencyStatusesEnum,
  NO_ANSWERS_ATTACHED_ANSWER_TYPE,
} from '@/lib/config/constants'
import {
  useGetAnswerTypesQuery,
  useCreateVariableMutation,
  useGetProjectQuery,
  useEditVariableQuery,
} from '@/lib/api/modules'
import { useToast } from '@/lib/hooks'
import { ModalContext } from '@/lib/contexts'
import { skipToken } from '@reduxjs/toolkit/dist/query'
import type {
  VariableStepperComponent,
  StepperSteps,
  VariableInputsForm,
} from '@/types'

const VariableStepper: VariableStepperComponent = ({
  projectId,
  variableId = null,
}) => {
  const { t } = useTranslation('variables')
  const { newToast } = useToast()
  const { closeModal } = useContext(ModalContext)

  const { isDrawerOpen, closeDrawer } = useContext(DrawerContext)

  const [filesToAdd, setFilesToAdd] = useState<File[]>([])
  const [rangeError, setRangeError] = useState('')
  const [existingFilesToRemove, setExistingFilesToRemove] = useState<number[]>(
    []
  )

  const { data: answerTypes, isSuccess: isAnswerTypeSuccess } =
    useGetAnswerTypesQuery()

  const { data: project, isSuccess: isProjectSuccess } =
    useGetProjectQuery(projectId)

  const {
    data: variable,
    isSuccess: isGetVariableSuccess,
    isError: isGetVariableError,
    error: getVariableError,
  } = useEditVariableQuery(variableId ?? skipToken)

  const [
    createVariable,
    {
      isSuccess: isCreateVariableSuccess,
      isError: isCreateVariableError,
      error: createVariableError,
      isLoading: isCreateVariableLoading,
    },
  ] = useCreateVariableMutation()

  useEffect(() => {
    if (isCreateVariableSuccess) {
      newToast({
        message: t('notifications.createSuccess', { ns: 'common' }),
        status: 'success',
      })
      closeModal()
    }
  }, [isCreateVariableSuccess])

  const methods = useForm<VariableInputsForm>({
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
      placeholder: undefined,
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
      complaintCategoryOptions: undefined,
    },
  })

  useEffect(() => {
    if (isGetVariableSuccess && isProjectSuccess) {
      console.log('variable', variable, variableId)
      methods.reset({
        label: variable.labelTranslations[project.language.code],
        description: variable.descriptionTranslations[project.language.code],
        minMessageError:
          variable.minMessageErrorTranslations[project.language.code],
        maxMessageError:
          variable.maxMessageErrorTranslations[project.language.code],
        maxMessageWarning:
          variable.maxMessageWarningTranslations[project.language.code],
        minMessageWarning:
          variable.minMessageWarningTranslations[project.language.code],
        answerType: variable.answerType.id,
        type: variable.type,
        system: variable.system,
        answersAttributes: [],
        emergencyStatus: EmergencyStatusesEnum.Standard,
        formula: variable.formula,
        isEstimable: variable.isEstimable,
        isMandatory: variable.isMandatory,
        isIdentifiable: variable.isIdentifiable,
        isPreFill: variable.isPreFill,
        isNeonat: variable.isNeonat,
        maxValueError: variable.maxValueError,
        maxValueWarning: variable.maxValueWarning,
        minValueError: variable.minValueError,
        minValueWarning: variable.minValueWarning,
        placeholder: variable.placeholderTranslations[project.language.code],
        projectId: String(projectId),
        round: variable.round,
        stage: variable.stage,
        isUnavailable: variable.isUnavailable,
        complaintCategoryOptions: variable.nodeComplaintCategories?.map(
          NCC => ({
            value: String(NCC.complaintCategory.id),
            label:
              NCC.complaintCategory.labelTranslations[project.language.code],
          })
        ),
      })
    }
  }, [isGetVariableSuccess])

  const { remove } = useFieldArray({
    control: methods.control,
    name: 'answersAttributes',
  })

  const watchAnswerType: number = parseInt(methods.watch('answerType'))

  /**
   * If answerType change, we have to clear answers already set
   */
  useEffect(remove, [watchAnswerType])

  const { nextStep, activeStep, prevStep, setStep } = useSteps({
    initialStep: 0,
  })

  /**
   * Handle form submission
   */
  const onSubmit = (data: VariableInputsForm) => {
    const transformedData = VariableService.transformData(
      data,
      project?.language.code
    )
    createVariable({ ...transformedData, filesToAdd })
  }

  /**
   * Handle navigation to the previous step
   */
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

  /**
   * Handle step validation and navigation to the next step
   */
  const handleNext = async () => {
    let isValid = false
    setRangeError('')

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

        if (isValid) {
          const minValueError = methods.getValues('minValueError')
          const maxValueError = methods.getValues('maxValueError')
          const minValueWarning = methods.getValues('minValueWarning')
          const maxValueWarning = methods.getValues('maxValueWarning')
          const rangeIsValid = VariableService.validateRanges({
            minValueError,
            maxValueError,
            minValueWarning,
            maxValueWarning,
          })

          if (!rangeIsValid) {
            setRangeError(
              t('invalidRange', {
                ns: 'validations',
                defaultValue: '',
              })
            )

            isValid = false
          }
        }

        break
      }
      case 1: {
        isValid = await methods.trigger(['answersAttributes'])
        if (isValid) {
          const answers = methods.getValues('answersAttributes')
          const category = methods.getValues('type')
          const answerType = parseInt(methods.getValues('answerType'))

          if (
            !ANSWER_TYPE_WITHOUT_OPERATOR_AND_ANSWER.includes(answerType) &&
            !CATEGORIES_WITHOUT_OPERATOR.includes(category)
          ) {
            const { isOverlapValid, message } =
              VariableService.validateOverlap(answers)
            if (!isOverlapValid) {
              methods.setError('answersAttributes', {
                message: t(`overlap.${message}`, {
                  ns: 'validations',
                  defaultValue: '',
                }),
              })

              // Overlap not valid
              isValid = false
            }
          }
        }
        break
      }
    }

    console.log(methods.formState.errors)
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

    if (isDrawerOpen) {
      closeDrawer()
    }
  }

  /**
   * List of steps
   */
  const steps: StepperSteps[] = useMemo(() => {
    if (answerTypes) {
      return [
        {
          label: t('stepper.variable.title'),
          content: (
            <React.Fragment>
              <VariableForm projectId={projectId} answerTypes={answerTypes} />
              {rangeError && (
                <Box w='full' mt={8} textAlign='center'>
                  <ErrorMessage error={rangeError} />
                </Box>
              )}
            </React.Fragment>
          ),
        },
        {
          label: t('stepper.answers.title'),
          content: (
            <AnswersForm
              projectId={projectId}
              existingAnswers={variable?.answers}
            />
          ),
          description: t('stepper.answers.description'),
        },
        {
          label: t('stepper.medias.title'),
          content: (
            <MediaForm
              filesToAdd={filesToAdd}
              setFilesToAdd={setFilesToAdd}
              existingFiles={variable?.files || []}
              existingFilesToRemove={existingFilesToRemove}
              setExistingFilesToRemove={setExistingFilesToRemove}
            />
          ),
        },
      ]
    }
    return []
  }, [answerTypes, filesToAdd, rangeError, variable])

  if (isAnswerTypeSuccess && isProjectSuccess) {
    return (
      <Flex flexDir='column' width='100%'>
        <FormProvider<VariableInputsForm>
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

  return <Spinner size='xl' />
}

export default VariableStepper
