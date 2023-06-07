/**
 * The external imports
 */
import { Controller, useFormContext } from 'react-hook-form'
import {
  Checkbox as ChakraCheckbox,
  FormControl,
  FormErrorMessage,
} from '@chakra-ui/react'
import { ErrorMessage } from '@hookform/error-message'

/**
 * The internal imports
 */
import type { GenericInputComponent } from '@/types'

const Checkbox: GenericInputComponent = ({
  name,
  isRequired,
  label,
  isDisabled,
}) => {
  const {
    control,
    formState: { errors },
  } = useFormContext()

  return (
    <FormControl isInvalid={!!errors[name]} isRequired={isRequired}>
      <Controller
        control={control}
        name={name}
        render={({ field: { onChange, value } }) => (
          <ChakraCheckbox
            id={name}
            name={name}
            onChange={onChange}
            isChecked={value}
            isDisabled={isDisabled}
          >
            {label}
          </ChakraCheckbox>
        )}
      />
      <ErrorMessage as={<FormErrorMessage />} name={name} errors={errors} />
    </FormControl>
  )
}

export default Checkbox
