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
import { AnswerService, DiagramService, VariableService } from '@/lib/services'
import {
  ANSWER_TYPE_WITHOUT_OPERATOR_AND_ANSWER,
  CATEGORIES_WITHOUT_ANSWERS,
  CATEGORIES_WITHOUT_OPERATOR,
  NO_ANSWERS_ATTACHED_ANSWER_TYPE,
} from '@/lib/config/constants'
import {
  useCreateVariableMutation,
  useGetProjectQuery,
  useEditVariableQuery,
  useUpdateVariableMutation,
  useCreateInstanceMutation,
} from '@/lib/api/modules'
import { useAppRouter, useToast } from '@/lib/hooks'
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
}) => {
  const { t } = useTranslation('variables')
  const { newToast } = useToast()

  const {
    query: { instanceableId, instanceableType },
  } = useAppRouter()

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

  const [createInstance, { isSuccess: isCreateInstanceSuccess }] =
    useCreateInstanceMutation()

  const [
    updateVariable,
    {
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
    if (isCreateVariableSuccess) {
      newToast({
        message: t('notifications.createSuccess', { ns: 'common' }),
        status: 'success',
      })
      if (instanceableId && instanceableType && newVariable) {
        const type = DiagramService.getInstanceableType(instanceableType)

        if (type) {
          createInstance({
            instanceableType: type,
            instanceableId: instanceableId,
            nodeId: newVariable.id,
            positionX: 100,
            positionY: 100,
          })
        }
      } else {
        closeModal()
      }
    }
  }, [isCreateVariableSuccess])

  useEffect(() => {
    if (isUpdateVariableSuccess) {
      newToast({
        message: t('notifications.updateSuccess', { ns: 'common' }),
        status: 'success',
      })

      closeModal()
    }
  }, [isUpdateVariableSuccess])

  useEffect(() => {
    if (isCreateInstanceSuccess) {
      closeModal()
    }
  }, [isCreateInstanceSuccess])

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
    return [
      {
        label: t('stepper.variable.title'),
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
        <Box mt={6} textAlign='center'>
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
            <Steps variant='circles-alt' activeStep={activeStep}>
              {steps.map(({ label, content, description }) => (
                <Step label={label} key={label} description={description}>
                  <VStack alignItems='flex-start' spacing={8} mt={8}>
                    <Box w='full'>{content}</Box>
                    <Flex gap={2}>
                      {activeStep !== 0 && (
                        <Button
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
