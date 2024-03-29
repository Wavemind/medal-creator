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
  Flex,
} from '@chakra-ui/react'
import { useFieldArray, useForm } from 'react-hook-form'
import { useTranslation } from 'next-i18next'
import { yupResolver } from '@hookform/resolvers/yup'
import type { SubmitHandler } from 'react-hook-form'

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
import { useAppRouter } from '@/lib/hooks/useAppRouter'
import { useProject } from '@/lib/hooks/useProject'
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
    resolver: yupResolver(MedalDataConfigService.getValidationSchema(t)),
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

  const onSubmit: SubmitHandler<MedalDataConfigVariableInputs> = data =>
    updateAlgorithm({
      id: algorithmId,
      ...MedalDataConfigService.transformData(data),
    })

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

  /**
   * Implement debouncing of variables using a setTimeout
   */
  const loadOptions = useCallback((inputValue: string, callback: any) => {
    let timeoutId: NodeJS.Timeout | null = null

    // Clear any previous timeouts
    if (timeoutId) {
      clearTimeout(timeoutId)
    }

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
              w='full'
              position='sticky'
              top={-10}
              zIndex={1000}
              bg='white'
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
            <VStack spacing={6} px={2} w='full' position='relative'>
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
          </VStack>
        </form>
        <VStack spacing={6} mt={6} w='full'>
          {algorithm.project.formattedBasicQuestions.map(basicQuestion => (
            <HStack w='full' key={basicQuestion.variable.id}>
              <HStack alignItems='flex-end' w='full' spacing={4}>
                <Flex flex={1} />
                <Flex flex={1}>
                  <Text>{basicQuestion.apiKey}</Text>
                </Flex>
                <Flex flex={1}>
                  <Text>{`${basicQuestion.variable.id} - ${extractTranslation(
                    basicQuestion.variable.labelTranslations,
                    projectLanguage
                  )}`}</Text>
                </Flex>
                <Flex flex={0.1} />
              </HStack>
            </HStack>
          ))}
        </VStack>
      </FormProvider>
    )
  }

  return <Spinner size='xl' />
}

export default MedalDataConfigForm
