/**
 * The external imports
 */
import { FC } from 'react'
import { Controller, useFormContext } from 'react-hook-form'
import {
  FormLabel,
  FormControl,
  FormErrorMessage,
  NumberInput as ChakraNumberInput,
  NumberInputField,
  NumberInputStepper,
  NumberIncrementStepper,
  NumberDecrementStepper,
} from '@chakra-ui/react'

/**
 * The internal imports
 */
import type { BaseInputProps } from '@/types'

/**
 * Type definitions
 */
type NumberInputProps = BaseInputProps & {
  min?: number
  max?: number
}

const NumberInput: FC<NumberInputProps> = ({
  name,
  isRequired,
  label,
  min = 0,
  max,
  ...restProps
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
        render={({ field: { value, onChange } }) => (
          <ChakraNumberInput
            value={value}
            name={name}
            min={min}
            max={max}
            onChange={onChange}
            {...restProps}
          >
            <NumberInputField />
            <NumberInputStepper>
              <NumberIncrementStepper />
              <NumberDecrementStepper />
            </NumberInputStepper>
          </ChakraNumberInput>
        )}
      />

      <FormErrorMessage>{errors[name]?.message as string}</FormErrorMessage>
    </FormControl>
  )
}

export default NumberInput
