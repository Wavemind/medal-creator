/**
 * The external imports
 */
import React, { useContext, useMemo } from 'react'
import { Step, Steps, useSteps } from 'chakra-ui-steps'
import { Flex, VStack, Box, Button, Spinner } from '@chakra-ui/react'
import { useTranslation } from 'next-i18next'
import { yupResolver } from '@hookform/resolvers/yup'
import * as yup from 'yup'
import { useForm } from 'react-hook-form'

/**
 * The internal imports
 */
import { FormProvider, DrugForm, FormulationsForm } from '@/components'

import { useGetProjectQuery } from '@/lib/api/modules'
import { useToast } from '@/lib/hooks'
import { ModalContext } from '@/lib/contexts'
import type { DrugInputs, DrugStepperComponent, StepperSteps } from '@/types'

const DrugStepper: DrugStepperComponent = ({ projectId, drugId }) => {
  const { t } = useTranslation('drugs')
  const { newToast } = useToast()
  const { closeModal } = useContext(ModalContext)

  const { data: project, isSuccess: isProjectSuccess } =
    useGetProjectQuery(projectId)

  const methods = useForm<DrugInputs>({
    resolver: yupResolver(
      yup.object({
        label: yup.string().label(t('label')).required(),
        levelOfUrgency: yup
          .number()
          .transform(value => (isNaN(value) ? undefined : value))
          .nullable(),
        formulationsAttributes: yup
          .array()
          .label(t('stepper.formulations'))
          .min(1)
          .required(),
      })
    ),
    reValidateMode: 'onSubmit',
    defaultValues: {
      label: '',
      description: '',
      levelOfUrgency: 5,
      isAntibiotic: false,
      isAntiMalarial: false,
      projectId: projectId,
      formulationsAttributes: [],
    },
  })

  const { nextStep, activeStep, prevStep } = useSteps({
    initialStep: 0,
  })

  /**
   * Handle form submission
   */
  const onSubmit = (data: DrugInputs) => {
    // const transformedData = VariableService.transformData(
    //   data,
    //   project?.language.code
    // )
    // createVariable({ ...transformedData, filesToAdd })
  }

  /**
   * Handle navigation to the previous step
   */
  const handlePrevious = () => prevStep()

  /**
   * Handle step validation and navigation to the next step
   */
  const handleNext = async () => {
    let isValid = false

    switch (activeStep) {
      case 0: {
        isValid = await methods.trigger(['label'])
        break
      }
    }

    if (isValid) {
      nextStep()
    }
  }

  /**
   * List of steps
   */
  const steps: StepperSteps[] = useMemo(() => {
    return [
      {
        label: t('stepper.drug'),
        content: <DrugForm projectId={projectId} />,
      },
      {
        label: t('stepper.formulations'),
        content: <FormulationsForm projectId={projectId} />,
      },
    ]
  }, [t])

  if (isProjectSuccess) {
    return (
      <Flex flexDir='column' width='100%'>
        <Box mt={6} textAlign='center'>
          {/* {(isCreateVariableError || isUpdateVariableError) && (
            <ErrorMessage
              error={{ ...createVariableError, ...updateVariableError }}
            />
          )} */}
        </Box>
        <FormProvider
          methods={methods}
          isError={false} // TODO: ADD
          error={{}} // TODO: ADD
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
                          // TODO: ADD DISABLED
                        >
                          {t('previous', { ns: 'common' })}
                        </Button>
                      )}
                      {activeStep === 0 && (
                        <Button data-cy='next' onClick={handleNext}>
                          {t('next', { ns: 'common' })}
                        </Button>
                      )}
                      {activeStep === 1 && (
                        <Button
                          type='submit'
                          data-cy='submit'
                          // TODO: ADD DISABLED
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

export default DrugStepper
