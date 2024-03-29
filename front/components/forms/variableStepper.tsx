/**
 * The external imports
 */
import React, { useEffect, useMemo, useState } from 'react'
import {
  Flex,
  VStack,
  Box,
  Button,
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
import { useAppRouter } from '@/lib/hooks/useAppRouter'
import { useDrawer } from '@/lib/hooks/useDrawer'
import { useModal } from '@/lib/hooks/useModal'
import { useProject } from '@/lib/hooks/useProject'
import { skipToken } from '@reduxjs/toolkit/dist/query'
import {
  VariableStepperComponent,
  StepperSteps,
  VariableInputsForm,
  EmergencyStatusEnum,
} from '@/types'

const VariableStepper: VariableStepperComponent = ({
  formEnvironment,
  variableId = null,
  callback,
}) => {
  const { t } = useTranslation('variables')

  const { close: closeModal } = useModal()
  const { isOpen: isDrawerOpen, close: closeDrawer } = useDrawer()
  const { projectLanguage } = useProject()
  const {
    query: { projectId },
  } = useAppRouter()

  const [filesToAdd, setFilesToAdd] = useState<File[]>([])
  const [rangeError, setRangeError] = useState('')
  const [isRestricted, setIsRestricted] = useState(false)
  const [existingFilesToRemove, setExistingFilesToRemove] = useState<number[]>(
    []
  )

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

  const handleSuccess = () => {
    const nodeToReturn = updatedVariable || newVariable

    if (callback && nodeToReturn) {
      callback(nodeToReturn)
    }

    closeModal()
  }

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
    if (isGetVariableSuccess) {
      methods.reset(
        VariableService.buildFormData(variable, projectLanguage, projectId)
      )
      setIsRestricted(variable.isDeployed)
    }
  }, [isGetVariableSuccess, variable])

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
    const transformedData = VariableService.transformData(data, projectLanguage)

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
    if (
      isValid &&
      ((activeStep === 0 &&
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
              isEdit={!!variableId}
              formEnvironment={formEnvironment}
              isRestricted={isRestricted}
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
        content: (
          <AnswersForm
            isRestricted={isRestricted || !!variable?.hasInstances}
          />
        ),
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
  }, [filesToAdd, rangeError, variable, existingFilesToRemove, isRestricted])

  return (
    <Flex flexDir='column' width='100%'>
      <FormProvider
        methods={methods}
        isError={isCreateVariableError || isUpdateVariableError}
        error={{ ...createVariableError, ...updateVariableError }}
        isSuccess={isCreateVariableSuccess || isUpdateVariableSuccess}
        callbackAfterSuccess={handleSuccess}
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
            <Flex
              gap={2}
              w='full'
              justifyContent={activeStep > 0 ? 'space-between' : 'flex-end'}
            >
              {activeStep !== 0 && (
                <Button
                  variant='ghost'
                  onClick={handlePrevious}
                  data-testid='previous'
                  disabled={isCreateVariableLoading || isUpdateVariableLoading}
                >
                  {t('previous', { ns: 'common' })}
                </Button>
              )}
              {activeStep !== 2 && (
                <Button data-testid='next' onClick={handleNext}>
                  {t('next', { ns: 'common' })}
                </Button>
              )}

              {activeStep === 2 && (
                <Button
                  type='submit'
                  data-testid='submit'
                  disabled={isCreateVariableLoading || isUpdateVariableLoading}
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

export default VariableStepper
