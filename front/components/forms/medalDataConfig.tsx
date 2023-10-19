/**
 * The external imports
 */
import React, { useEffect } from 'react'
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
import debounce from 'lodash/debounce'

/**
 * The internal imports
 */
import medalDataConfigService from '@/lib/services/medalDataConfig.service'
import FormProvider from '@/components/formProvider'
import DeleteIcon from '@/assets/icons/Delete'
import Input from '@/components/inputs/input'
import AsyncAutocomplete from '@/components/inputs/asyncAutocomplete'
import { useGetAlgorithmMedalDataConfigQuery } from '@/lib/api/modules/enhanced/algorithm.enhanced'
import { useLazyGetVariablesQuery } from '@/lib/api/modules/enhanced/variable.enhanced'
import { useAppRouter } from '@/lib/hooks'
import { extractTranslation } from '@/lib/utils/string'
import { useGetProjectQuery } from '@/lib/api/modules/enhanced/project.enhanced'
import type { MedalDataConfigComponent } from '@/types'

const MedalDataConfigForm: MedalDataConfigComponent = ({ algorithmId }) => {
  const { t } = useTranslation('medalDataConfig')
  const { data: algorithm, isSuccess: isAlgorithmSuccess } =
    useGetAlgorithmMedalDataConfigQuery({ id: algorithmId })

  const {
    query: { projectId },
  } = useAppRouter()

  // TODO: Replace with useProject
  const [getVariables] = useLazyGetVariablesQuery()
  const { data: project } = useGetProjectQuery({
    id: projectId,
  })

  const methods = useForm<TODO>({
    reValidateMode: 'onSubmit',
    defaultValues: {
      medalDataConfigAttributes: [],
    },
  })

  const { fields, prepend, remove, update } = useFieldArray({
    control: methods.control,
    name: 'medalDataConfigAttributes',
  })

  useEffect(() => {
    if (isAlgorithmSuccess && algorithm) {
      methods.reset(medalDataConfigService.buildFormData(algorithm))
    }
  }, [algorithm, isAlgorithmSuccess])

  const onSubmit: SubmitHandler = data => {
    console.log('hello', data)
  }

  /**
   * Add new api config
   */
  const handleAppend = (): void =>
    prepend({
      label: '',
      apiKey: '',
      _destroy: false,
      variableId: '',
    })

  /**
   * Remove config in creation or add _destroy in update mode
   * @param apiConfig position in fields array
   */
  const handleRemove = (index: number): void => {
    const currentField = fields[index]

    // TODO: Need probably an another props
    if (Object.prototype.hasOwnProperty.call(currentField, 'id')) {
      update(index, { ...currentField, _destroy: true })
    } else {
      remove(index)
    }
  }

  const debouncedVariable = async (inputValue: string) => {
    return debounce(
      async () =>
        await getVariables({
          projectId,
          searchTerm: inputValue,
          first: 5,
        })
    )
  }

  // TODO: Need to fetch medal_r_config of project to display. Discuss with Manu, add field in algorithm to fetch this
  // TODO: Need autocomplete
  // TODO: Check if everything in search is in lowercase for matching in API
  if (isAlgorithmSuccess) {
    return (
      <FormProvider methods={methods} isError={false} error={{}}>
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
                <Button onClick={methods.handleSubmit(onSubmit)}>
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
                  {t('variableId')}
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
                        name={`medalDataConfigAttributes[${index}].label`}
                        isRequired
                      />
                      <Input
                        name={`medalDataConfigAttributes[${index}].apiKey`}
                        isRequired
                      />
                      <AsyncAutocomplete
                        name={`medalDataConfigAttributes[${index}].variableId`}
                        isRequired
                        loadOptions={async (inputValue, callback) => {
                          // TODO: Defaut get first five
                          // and display default value
                          let test = []
                          console.log('before')
                          const response = await debouncedVariable(inputValue)
                          console.log('after', response)

                          if (response.isSuccess && project) {
                            test = response.data.edges.map(edge => ({
                              label: extractTranslation(
                                edge.node.labelTranslations,
                                project.language.code
                              ),
                              value: edge.node.id,
                            }))
                          }

                          callback(test)
                        }}
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
