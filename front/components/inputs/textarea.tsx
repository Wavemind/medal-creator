/**
 * The external imports
 */
import { Controller, useFormContext } from 'react-hook-form'
import {
  Textarea as ChakraTextarea,
  FormControl,
  FormErrorMessage,
  FormHelperText,
} from '@chakra-ui/react'
import { ErrorMessage } from '@hookform/error-message'

/**
 * The internal imports
 */
import FormLabel from '@/components/formLabel'
import type { TextAreaComponent } from '@/types'

const Textarea: TextAreaComponent = ({
  name,
  isRequired,
  label,
  helperText = null,
  ...restProps
}) => {
  const {
    control,
    formState: { errors },
  } = useFormContext()

  return (
    <FormControl isInvalid={!!errors[name]}>
      <FormLabel name={name} isRequired={isRequired}>
        {label}
      </FormLabel>
      <Controller
        control={control}
        name={name}
        render={({ field: { ...rest } }) => (
          <ChakraTextarea id={name} {...rest} {...restProps} />
        )}
      />

      {helperText && <FormHelperText>{helperText}</FormHelperText>}
      <ErrorMessage as={<FormErrorMessage />} name={name} errors={errors} />
    </FormControl>
  )
}

export default Textarea
