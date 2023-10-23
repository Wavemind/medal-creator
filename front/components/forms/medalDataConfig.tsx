/**
 * The external imports
 */
import React, { useCallback, useEffect } from 'react'
import {
  Box,
  Button,
  Text,
  HStack,
  IconButton,
  Spinner,
  VStack,
  Divider,
} from '@chakra-ui/react'
import { SubmitHandler, useFieldArray, useForm } from 'react-hook-form'
import { useTranslation } from 'next-i18next'

/**
 * The internal imports
 */
import MedalDataConfigService from '@/lib/services/medalDataConfig.service'
import FormProvider from '@/components/formProvider'
import DeleteIcon from '@/assets/icons/Delete'
import Input from '@/components/inputs/input'
import AsyncAutocomplete from '@/components/inputs/asyncAutocomplete'
import {
  useGetAlgorithmMedalDataConfigQuery,
  useUpdateAlgorithmMutation,
} from '@/lib/api/modules/enhanced/algorithm.enhanced'
import { useLazyGetVariablesQuery } from '@/lib/api/modules/enhanced/variable.enhanced'
import { useAppRouter, useProject } from '@/lib/hooks'
import { extractTranslation } from '@/lib/utils/string'
import type { MedalDataConfigVariableInputs } from '@/types'

const MedalDataConfigForm = () => {
  const { t } = useTranslation('medalDataConfig')

  const {
    query: { projectId, algorithmId },
  } = useAppRouter()
  const { projectLanguage } = useProject()

  const { data: algorithm, isSuccess: isAlgorithmSuccess } =
    useGetAlgorithmMedalDataConfigQuery({ id: algorithmId })

  const [getVariables] = useLazyGetVariablesQuery()

  const [
    updateAlgorithm,
    {
      isSuccess: isUpdateAlgorithmSuccess,
      isError: isUpdateAlgorithmError,
      error: updateAlgorithmError,
      isLoading: isUpdateAlgorithmLoading,
    },
  ] = useUpdateAlgorithmMutation()

  const methods = useForm<MedalDataConfigVariableInputs>({
    reValidateMode: 'onSubmit',
    defaultValues: {
      medalDataConfigVariablesAttributes: [],
    },
  })

  const { fields, prepend, remove, update } = useFieldArray({
    control: methods.control,
    name: 'medalDataConfigVariablesAttributes',
  })

  useEffect(() => {
    if (isAlgorithmSuccess && algorithm) {
      methods.reset(
        MedalDataConfigService.buildFormData(algorithm, projectLanguage)
      )
    }
  }, [algorithm, isAlgorithmSuccess])

  const onSubmit: SubmitHandler<MedalDataConfigVariableInputs> = data => {
    updateAlgorithm({
      id: algorithmId,
      ...MedalDataConfigService.transformData(data),
    })
  }

  /**
   * Add new api config
   */
  const handleAppend = (): void =>
    prepend({
      medalDataConfigId: '',
      label: '',
      apiKey: '',
      variableValue: { label: '', value: '' },
      _destroy: false,
    })

  /**
   * Remove config in creation or add _destroy in update mode
   * @param apiConfig position in fields array
   */
  const handleRemove = (index: number): void => {
    const currentField = fields[index]
    if (currentField.medalDataConfigId === '') {
      remove(index)
    } else {
      update(index, { ...currentField, _destroy: true })
    }
  }

  const loadOptions = useCallback((inputValue: string, callback: any) => {
    // Implement debouncing using a setTimeout
    let timeoutId
    // Clear any previous timeouts
    clearTimeout(timeoutId)
    timeoutId = setTimeout(async () => {
      const response = await getVariables({
        projectId,
        searchTerm: inputValue,
        first: 10,
      })

      if (response.isSuccess) {
        const options = response.data.edges.map(edge => ({
          label: `${edge.node.id} - ${extractTranslation(
            edge.node.labelTranslations,
            projectLanguage
          )}`,
          value: edge.node.id,
        }))
        callback(options)
      }
    }, 300)
  }, [])

  console.log(algorithm)

  // TODO: Display basic questions from medal_r_config in project
  if (isAlgorithmSuccess) {
    return (
      <FormProvider<MedalDataConfigVariableInputs>
        methods={methods}
        isError={isUpdateAlgorithmError}
        error={updateAlgorithmError}
        isSuccess={isUpdateAlgorithmSuccess}
      >
        <form>
          <VStack spacing={6} w='full' position='relative'>
            <Box
              w='102%'
              position='sticky'
              top={-10}
              zIndex='999'
              bg='white'
              px={4}
              py={4}
            >
              <HStack justifyContent='space-between' w='full'>
                <Button onClick={handleAppend}>{t('addRow')}</Button>
                <Button
                  onClick={methods.handleSubmit(onSubmit)}
                  isLoading={isUpdateAlgorithmLoading}
                >
                  {t('save', { ns: 'common' })}
                </Button>
              </HStack>
              <HStack justifyContent='space-between' w='full' mt={6}>
                <Text
                  flex={1}
                  fontWeight='normal'
                  fontSize='sm'
                  textAlign='left'
                  color='gray.600'
                >
                  {t('label')}
                </Text>
                <Text
                  flex={1}
                  variant='h3'
                  fontWeight='normal'
                  fontSize='sm'
                  textAlign='left'
                  color='gray.600'
                >
                  {t('apiKey')}
                </Text>
                <Text
                  flex={1}
                  variant='h3'
                  fontWeight='normal'
                  fontSize='sm'
                  textAlign='left'
                  color='gray.600'
                >
                  {t('variable')}
                </Text>
                <Box w={8} />
              </HStack>
              <Divider my={2} />
            </Box>
            {fields.map((field, index) => {
              if (!field._destroy) {
                return (
                  <HStack w='full' key={field.id}>
                    <HStack alignItems='flex-end' w='full' spacing={4}>
                      <Input
                        name={`medalDataConfigVariablesAttributes[${index}].label`}
                        isRequired
                      />
                      <Input
                        name={`medalDataConfigVariablesAttributes[${index}].apiKey`}
                        isRequired
                      />
                      <AsyncAutocomplete
                        name={`medalDataConfigVariablesAttributes[${index}].variableValue`}
                        isRequired
                        placeholder={t('placeholder')}
                        loadOptions={loadOptions}
                      />
                      <IconButton
                        aria-label='delete'
                        icon={<DeleteIcon />}
                        variant='ghost'
                        data-testid={`delete-api-config-${index}`}
                        onClick={() => handleRemove(index)}
                      />
                    </HStack>
                  </HStack>
                )
              }
            })}
          </VStack>
        </form>
      </FormProvider>
    )
  }

  return <Spinner size='xl' />
}

export default MedalDataConfigForm
