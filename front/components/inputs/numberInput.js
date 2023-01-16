/**
 * The external imports
 */
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

const NumberInput = ({
  name,
  isRequired = true,
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
    <FormControl isInvalid={errors[name]} isRequired={isRequired}>
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

      <FormErrorMessage>
        {errors[name] && errors[name].message}
      </FormErrorMessage>
    </FormControl>
  )
}

export default NumberInput
