/**
 * The external imports
 */
import { FC } from 'react'
import {
  FormLabel,
  Select as ChakraSelect,
  FormControl,
  FormErrorMessage,
} from '@chakra-ui/react'
import { useFormContext, Controller, FieldValues } from 'react-hook-form'

/**
 * The internal imports
 */
import type { Paginated, LabelTranslations, BaseInputProps } from '@/types'

/**
 * Type definitions
 */
type Option = {
  [key: string]: string | number
}

type PaginatedWithTranslations = Paginated<LabelTranslations>

type SelectProps = BaseInputProps & {
  options: Option[] | PaginatedWithTranslations
  labelOption?: string
  valueOption?: string
}

const Select: FC<SelectProps> = ({
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
      <FormErrorMessage>{errors[name]?.message as string}</FormErrorMessage>
    </FormControl>
  )
}

export default Select
