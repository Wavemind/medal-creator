/**
 * The external imports
 */
import { Controller, useFormContext } from 'react-hook-form'
import {
  Input as ChakraInput,
  FormLabel,
  FormControl,
  FormErrorMessage,
  FormHelperText,
} from '@chakra-ui/react'
import { ErrorMessage } from '@hookform/error-message'

/**
 * The internal imports
 */
import type { InputComponent } from '@/types'

const Input: InputComponent = ({
  name,
  isRequired = false,
  label,
  type = 'text',
  helperText,
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
        render={({ field: { ...rest } }) => (
          <ChakraInput
            id={name}
            type={type}
            autoComplete='off'
            {...rest}
            {...restProps}
          />
        )}
      />

      {helperText && <FormHelperText>{helperText}</FormHelperText>}
      <ErrorMessage as={<FormErrorMessage />} name={name} errors={errors} />
    </FormControl>
  )
}

export default Input
