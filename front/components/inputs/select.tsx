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
import { useFormContext, Controller } from 'react-hook-form'

/**
 * Type imports
 */
import { BaseInputProps } from '@/types/input'

/**
 * Type definitions
 */
type Option = {
  [key: string]: string
}

type SelectProps = BaseInputProps & {
  options: Option[]
  labelOption?: string
  valueOption?: string
}

// TODO : Check this one. I'm not 100% sure. Especially the keyof part below
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
  } = useFormContext()

  return (
    <FormControl isInvalid={!!errors[name]} isRequired={isRequired}>
      <FormLabel htmlFor={name}>{label}</FormLabel>
      <Controller
        control={control}
        name={name}
        render={({ field: { ...rest } }) => (
          <ChakraSelect id={name} {...rest}>
            <option key={null} value=''></option>
            {options?.map(option => (
              <option
                key={option[valueOption as keyof Option]}
                value={option[valueOption as keyof Option]}
              >
                {option[labelOption as keyof Option]}
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
