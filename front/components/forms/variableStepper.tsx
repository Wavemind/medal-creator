/**
 * The external imports
 */
import React, { useContext, useEffect, useMemo, useState } from 'react'
import {
  Flex,
  VStack,
  Box,
  Button,
  Spinner,
  useSteps,
  StepDescription,
  Step,
  StepIcon,
  StepIndicator,
  StepNumber,
  StepSeparator,
  StepStatus,
  StepTitle,
  Stepper,
} from '@chakra-ui/react'
import { useTranslation } from 'next-i18next'
import { yupResolver } from '@hookform/resolvers/yup'
import { useFieldArray, useForm } from 'react-hook-form'

/**
 * The internal imports
 */
import VariableForm from '@/components/forms/variable'
import AnswersForm from '@/components/forms/answers'
import MediaForm from '@/components/forms/media'
import FormProvider from '@/components/formProvider'
import ErrorMessage from '@/components/errorMessage'
import { DrawerContext } from '@/lib/contexts'
import AnswerService from '@/lib/services/answer.service'
import VariableService from '@/lib/services/variable.service'
import {
  ANSWER_TYPE_WITHOUT_OPERATOR_AND_ANSWER,
  CATEGORIES_WITHOUT_ANSWERS,
  CATEGORIES_WITHOUT_OPERATOR,
  NO_ANSWERS_ATTACHED_ANSWER_TYPE,
} from '@/lib/config/constants'
import {
  useCreateVariableMutation,
  useEditVariableQuery,
  useUpdateVariableMutation,
} from '@/lib/api/modules/enhanced/variable.enhanced'
import { useGetProjectQuery } from '@/lib/api/modules/enhanced/project.enhanced'
import { useToast } from '@/lib/hooks'
import { ModalContext } from '@/lib/contexts'
import { skipToken } from '@reduxjs/toolkit/dist/query'
import {
  VariableStepperComponent,
  StepperSteps,
  VariableInputsForm,
  EmergencyStatusEnum,
} from '@/types'

const VariableStepper: VariableStepperComponent = ({
  projectId,
  formEnvironment,
  variableId = null,
  callback,
}) => {
  const { t } = useTranslation('variables')
  const { newToast } = useToast()

  const { close: closeModal } = useContext(ModalContext)
  const { isOpen: isDrawerOpen, close: closeDrawer } = useContext(DrawerContext)

  const [filesToAdd, setFilesToAdd] = useState<File[]>([])
  const [rangeError, setRangeError] = useState('')
  const [existingFilesToRemove, setExistingFilesToRemove] = useState<number[]>(
    []
  )

  const { data: project, isSuccess: isProjectSuccess } = useGetProjectQuery({
    id: projectId,
  })

  const { data: variable, isSuccess: isGetVariableSuccess } =
    useEditVariableQuery(variableId ? { id: variableId } : skipToken)

  const [
    updateVariable,
    {
      data: updatedVariable,
      isSuccess: isUpdateVariableSuccess,
      isError: isUpdateVariableError,
      error: updateVariableError,
      isLoading: isUpdateVariableLoading,
    },
  ] = useUpdateVariableMutation()

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

  useEffect(() => {
    if (isCreateVariableSuccess && newVariable) {
      newToast({
        message: t('notifications.createSuccess', { ns: 'common' }),
        status: 'success',
      })
      if (callback) {
        callback(newVariable)
      }
      closeModal()
    }
  }, [isCreateVariableSuccess, newVariable])

  useEffect(() => {
    if (isUpdateVariableSuccess && updatedVariable) {
      newToast({
        message: t('notifications.updateSuccess', { ns: 'common' }),
        status: 'success',
      })
      if (callback) {
        callback(updatedVariable)
      }
      closeModal()
    }
  }, [isUpdateVariableSuccess, updatedVariable])

  const methods = useForm<VariableInputsForm>({
    resolver: yupResolver(VariableService.getValidationSchema(t)),
    reValidateMode: 'onSubmit',
    defaultValues: {
      projectId,
      answerTypeId: undefined,
      answersAttributes: [],
      description: '',
      emergencyStatus: EmergencyStatusEnum.Standard,
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
      methods.reset(
        VariableService.buildFormData(
          variable,
          project.language.code,
          projectId
        )
      )
    }
  }, [isGetVariableSuccess, isProjectSuccess])

  const { remove } = useFieldArray({
    control: methods.control,
    name: 'answersAttributes',
  })

  const watchAnswerTypeId: string = methods.watch('answerTypeId')

  /**
   * If answerType change, we have to clear answers already set
   */
  useEffect(() => {
    if (!variableId) {
      remove()
    }
  }, [watchAnswerTypeId])

  const { goToNext, goToPrevious, activeStep, setActiveStep } = useSteps({
    index: 0,
    count: 3,
  })

  /**
   * Handle form submission
   */
  const onSubmit = (data: VariableInputsForm) => {
    const transformedData = VariableService.transformData(
      data,
      project?.language.code
    )

    if (variableId) {
      updateVariable({
        ...transformedData,
        id: variableId,
        filesToAdd,
        existingFilesToRemove,
      })
    } else {
      createVariable({ ...transformedData, filesToAdd })
    }
  }

  /**
   * Handle navigation to the previous step
   */
  const handlePrevious = () => {
    if (
      (variableId && variable?.hasInstances) ||
      NO_ANSWERS_ATTACHED_ANSWER_TYPE.includes(
        parseInt(methods.getValues('answerTypeId'))
      ) ||
      (CATEGORIES_WITHOUT_ANSWERS.includes(methods.getValues('type')) &&
        !methods.getValues('isUnavailable'))
    ) {
      setActiveStep(0)
    } else {
      goToPrevious()
    }
  }

  /**
   * Handle step validation and navigation to the next step
   */
  const handleNext = async () => {
    let isValid = false
    const answerTypeId = parseInt(methods.getValues('answerTypeId'))

    setRangeError('')

    switch (activeStep) {
      case 0: {
        isValid = await methods.trigger([
          'answerTypeId',
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

          if (
            minValueError ||
            maxValueError ||
            minValueWarning ||
            maxValueWarning
          ) {
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
        }

        break
      }
      case 1: {
        isValid = await methods.trigger(['answersAttributes'])
        if (isValid) {
          const answers = methods.getValues('answersAttributes')
          const category = methods.getValues('type')

          if (
            !ANSWER_TYPE_WITHOUT_OPERATOR_AND_ANSWER.includes(answerTypeId) &&
            !CATEGORIES_WITHOUT_OPERATOR.includes(category)
          ) {
            const { isOverlapValid, message } =
              AnswerService.validateOverlap(answers)
            if (!isOverlapValid) {
              methods.setError('root', {
                type: 'validation',
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

    // Skip answers form if the question type doesn't have any OR if the answers are automatically generated (boolean) or if it is edit mode and the question is already used
    // TODO ADD is_deployed
    if (
      isValid &&
      ((variableId && variable?.hasInstances) ||
        (activeStep === 0 &&
          NO_ANSWERS_ATTACHED_ANSWER_TYPE.includes(answerTypeId)) ||
        (CATEGORIES_WITHOUT_ANSWERS.includes(methods.getValues('type')) &&
          !methods.getValues('isUnavailable')))
    ) {
      setActiveStep(2)
    } else if (isValid) {
      goToNext()
    }

    if (isDrawerOpen) {
      closeDrawer()
    }
  }

  /**
   * List of steps
   */
  const steps: StepperSteps[] = useMemo(() => {
    return [
      {
        title: t('stepper.variable.title'),
        content: (
          <React.Fragment>
            <VariableForm
              projectId={projectId}
              isEdit={!!variableId}
              formEnvironment={formEnvironment}
            />
            {rangeError && (
              <Box w='full' my={8} textAlign='center'>
                <ErrorMessage error={rangeError} />
              </Box>
            )}
          </React.Fragment>
        ),
      },
      {
        title: t('stepper.answers.title'),
        content: <AnswersForm projectId={projectId} />,
        description: t('stepper.answers.description'),
      },
      {
        title: t('stepper.medias.title'),
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
  }, [filesToAdd, rangeError, variable])

  if (isProjectSuccess) {
    return (
      <Flex flexDir='column' width='100%'>
        <Box mt={6} mb={2} textAlign='center'>
          {(isCreateVariableError || isUpdateVariableError) && (
            <ErrorMessage
              error={{ ...createVariableError, ...updateVariableError }}
            />
          )}
        </Box>
        <FormProvider
          methods={methods}
          isError={isCreateVariableError || isUpdateVariableError}
          error={{ ...createVariableError, ...updateVariableError }}
        >
          <form onSubmit={methods.handleSubmit(onSubmit)}>
            <Stepper index={activeStep}>
              {steps.map(({ title, description }) => (
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
                      <StepDescription>{description}</StepDescription>
                    </Box>
                  </VStack>
                  <StepSeparator />
                </Step>
              ))}
            </Stepper>
            <VStack spacing={8} mt={8}>
              <Box w='full'>{steps[activeStep].content}</Box>
              <Flex gap={2} w='full' justifyContent='space-between'>
                {activeStep !== 0 && (
                  <Button
                    variant='ghost'
                    onClick={handlePrevious}
                    data-cy='previous'
                    disabled={
                      isCreateVariableLoading || isUpdateVariableLoading
                    }
                  >
                    {t('previous', { ns: 'common' })}
                  </Button>
                )}
                {activeStep !== 2 && (
                  <Button data-cy='next' onClick={handleNext}>
                    {t('next', { ns: 'common' })}
                  </Button>
                )}

                {activeStep === 2 && (
                  <Button
                    type='submit'
                    data-cy='submit'
                    disabled={
                      isCreateVariableLoading || isUpdateVariableLoading
                    }
                  >
                    {t('save', { ns: 'common' })}
                  </Button>
                )}
              </Flex>
            </VStack>
          </form>
        </FormProvider>
      </Flex>
    )
  }

  return <Spinner size='xl' />
}

export default VariableStepper
