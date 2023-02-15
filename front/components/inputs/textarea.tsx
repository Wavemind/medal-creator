/**
 * The external imports
 */
import { FC } from 'react'
import { Controller, useFormContext } from 'react-hook-form'
import {
  Textarea as ChakraTextarea,
  FormLabel,
  FormControl,
  FormErrorMessage,
  FormHelperText,
} from '@chakra-ui/react'

/**
 * Type definitions
 */
import { BaseInputProps } from '@/types/input'

/**
 * Type definitions
 */
type TextAreaProps = BaseInputProps & {
  helperText: string
}

const Textarea: FC<TextAreaProps> = ({
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
    <FormControl isInvalid={!!errors[name]} isRequired={isRequired}>
      <FormLabel htmlFor={name}>{label}</FormLabel>
      <Controller
        control={control}
        name={name}
        render={({ field: { ...rest } }) => (
          <ChakraTextarea id={name} {...rest} {...restProps} />
        )}
      />

      {helperText && <FormHelperText>{helperText}</FormHelperText>}
      <FormErrorMessage>{errors[name]?.message as string}</FormErrorMessage>
    </FormControl>
  )
}

export default Textarea
