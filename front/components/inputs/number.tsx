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
import { ErrorMessage } from '@hookform/error-message'
import get from 'lodash/get'

/**
 * The internal imports
 */
import type { NumberComponent } from '@/types'

const Number: NumberComponent = ({
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

  const error = get(errors, name)

  return (
    <FormControl isInvalid={!!error} isRequired={isRequired}>
      <FormLabel htmlFor={name}>{label}</FormLabel>
      <Controller
        control={control}
        name={name}
        render={({ field: { value, onChange } }) => (
          <ChakraNumberInput
            value={value === null ? undefined : value}
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

      <ErrorMessage as={<FormErrorMessage />} name={name} errors={errors} />
    </FormControl>
  )
}

export default Number
