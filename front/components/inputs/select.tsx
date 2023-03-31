/**
 * The external imports
 */
import {
  FormLabel,
  Select as ChakraSelect,
  FormControl,
  FormErrorMessage,
} from '@chakra-ui/react'
import { useFormContext, Controller, FieldValues } from 'react-hook-form'
import { ErrorMessage } from '@hookform/error-message'

/**
 * The internal imports
 */
import type {
  SelectComponent,
  PaginatedWithTranslations,
  Option,
} from '@/types'

const Select: SelectComponent = ({
  label,
  options,
  name,
  isRequired,
  labelOption = 'label',
  valueOption = 'value',
}) => {
  const {
    control,
    formState: { errors },
  } = useFormContext<FieldValues>()

  function isPaginated(
    options: Option[] | PaginatedWithTranslations
  ): options is PaginatedWithTranslations {
    return (options as PaginatedWithTranslations).edges !== undefined
  }

  return (
    <FormControl isInvalid={!!errors[name]} isRequired={isRequired}>
      <FormLabel htmlFor={name}>{label}</FormLabel>
      <Controller
        control={control}
        name={name}
        render={({ field: { ...rest } }) => (
          <ChakraSelect id={name} {...rest}>
            <option key={null} value=''></option>
            {isPaginated(options)
              ? options.edges.map(option => (
                  <option key={option.node.id} value={option.node.id}>
                    {option.node.labelTranslations[labelOption]}
                  </option>
                ))
              : options.map(option => (
                  <option key={option[valueOption]} value={option[valueOption]}>
                    {option[labelOption]}
                  </option>
                ))}
          </ChakraSelect>
        )}
      />
      <ErrorMessage as={<FormErrorMessage />} name={name} errors={errors} />
    </FormControl>
  )
}

export default Select
