/**
 * The external imports
 */
import { Controller, useFormContext } from 'react-hook-form'
import {
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
import FormLabel from '@/components/formLabel'
import type { NumberComponent } from '@/types'

const Number: NumberComponent = ({
  name,
  isRequired,
  label = null,
  min,
  max,
  ...restProps
}) => {
  const {
    control,
    formState: { errors },
  } = useFormContext()

  const error = get(errors, name)

  return (
    <FormControl isInvalid={!!error}>
      {label && (
        <FormLabel name={name} isRequired={isRequired}>
          {label}
        </FormLabel>
      )}
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
