/**
 * The external imports
 */
import React, { useEffect, useMemo } from 'react'
import {
  Flex,
  VStack,
  Box,
  Button,
  Spinner,
  StepIcon,
  StepIndicator,
  StepNumber,
  StepSeparator,
  StepStatus,
  StepTitle,
  Stepper,
  Step,
  useSteps,
} from '@chakra-ui/react'
import { useTranslation } from 'next-i18next'
import { yupResolver } from '@hookform/resolvers/yup'
import { useForm } from 'react-hook-form'
import { skipToken } from '@reduxjs/toolkit/dist/query'

/**
 * The internal imports
 */
import FormProvider from '@/components/formProvider'
import DrugForm from '@/components/forms/drug'
import FormulationsForm from '@/components/forms/formulations'
import { useModal } from '@/lib/hooks'
import DrugService from '@/lib/services/drug.service'
import {
  useCreateDrugMutation,
  useEditDrugQuery,
  useUpdateDrugMutation,
} from '@/lib/api/modules/enhanced/drug.enhanced'
import { useGetProjectQuery } from '@/lib/api/modules/enhanced/project.enhanced'
import type { DrugInputs, DrugStepperComponent, StepperSteps } from '@/types'

const DrugStepper: DrugStepperComponent = ({ projectId, drugId }) => {
  const { t } = useTranslation('drugs')
  const { close } = useModal()

  const { goToNext, goToPrevious, activeStep } = useSteps({
    index: 0,
    count: 3,
  })

  const { data: project, isSuccess: isProjectSuccess } = useGetProjectQuery({
    id: projectId,
  })

  const {
    data: drug,
    isSuccess: isGetDrugSuccess,
    isError: isGetDrugError,
    error: getDrugError,
  } = useEditDrugQuery(drugId ? { id: drugId } : skipToken)

  const [
    createDrug,
    {
      isSuccess: isCreateDrugSuccess,
      isError: isCreateDrugError,
      error: createDrugError,
      isLoading: isCreateDrugLoading,
    },
  ] = useCreateDrugMutation()

  const [
    updateDrug,
    {
      isSuccess: isUpdateDrugSuccess,
      isError: isUpdateDrugError,
      error: updateDrugError,
      isLoading: isUpdateDrugLoading,
    },
  ] = useUpdateDrugMutation()

  useEffect(() => {
    if (isGetDrugSuccess && isProjectSuccess) {
      methods.reset(
        DrugService.buildFormData(drug, project.language.code, projectId)
      )
    }
  }, [isGetDrugSuccess, isProjectSuccess])

  const methods = useForm<DrugInputs>({
    resolver: yupResolver(DrugService.getValidationSchema(t)),
    reValidateMode: 'onSubmit',
    defaultValues: {
      label: '',
      description: '',
      levelOfUrgency: 5,
      isAntibiotic: false,
      isNeonat: false,
      isAntiMalarial: false,
      projectId,
      formulationsAttributes: [],
    },
  })

  /**
   * Handle form submission
   */
  const onSubmit = (data: DrugInputs) => {
    const transformedData = DrugService.transformData(
      data,
      project?.language.code
    )

    if (drugId) {
      updateDrug({ ...transformedData, id: drugId })
    } else {
      createDrug(transformedData)
    }
  }

  /**
   * Handle step validation and navigation to the next step
   */
  const handleNext = async () => {
    let isValid = false

    if (activeStep === 0) {
      isValid = await methods.trigger(['label'])
    }

    if (isValid) {
      goToNext()
    }
  }

  /**
   * List of steps
   */
  const steps: StepperSteps[] = useMemo(() => {
    return [
      {
        title: t('stepper.drug'),
        content: <DrugForm projectId={projectId} />,
      },
      {
        title: t('stepper.formulations'),
        content: <FormulationsForm projectId={projectId} />,
      },
    ]
  }, [t])

  if (isProjectSuccess) {
    return (
      <Flex flexDir='column' width='100%'>
        <FormProvider
          methods={methods}
          isError={isCreateDrugError || isUpdateDrugError || isGetDrugError}
          error={{ ...createDrugError, ...updateDrugError, ...getDrugError }}
          isSuccess={isCreateDrugSuccess || isUpdateDrugSuccess}
          callbackAfterSuccess={close}
        >
          <form onSubmit={methods.handleSubmit(onSubmit)}>
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
              <Flex gap={2} w='full' justifyContent='space-between'>
                {activeStep !== 0 && (
                  <Button
                    variant='ghost'
                    onClick={goToPrevious}
                    data-testid='previous'
                    disabled={isCreateDrugLoading || isUpdateDrugLoading}
                  >
                    {t('previous', { ns: 'common' })}
                  </Button>
                )}
                {activeStep === 0 && (
                  <Button data-testid='next' onClick={handleNext}>
                    {t('next', { ns: 'common' })}
                  </Button>
                )}
                {activeStep === 1 && (
                  <Button
                    type='submit'
                    data-testid='submit'
                    disabled={isCreateDrugLoading || isUpdateDrugLoading}
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

export default DrugStepper
