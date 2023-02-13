/**
 * The external imports
 */
import { FC } from 'react'
import { Controller, useFormContext } from 'react-hook-form'
import {
  Input as ChakraInput,
  FormLabel,
  FormControl,
  FormErrorMessage,
  FormHelperText,
} from '@chakra-ui/react'

/**
 * Type imports
 */
import { BaseInputProps } from '@/types/input'

/**
 * Type definitions
 */
interface Props extends BaseInputProps {
  type?: 'text' | 'password' | 'email'
  helperText?: string
}

const Input: FC<Props> = ({
  name,
  isRequired,
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
        render={({ field: { onChange, value } }) => (
          <ChakraInput
            id={name}
            name={name}
            value={value}
            onChange={onChange}
            type={type}
            {...restProps}
          />
        )}
      />

      {helperText && <FormHelperText>{helperText}</FormHelperText>}
      <FormErrorMessage>{errors[name]?.message as string}</FormErrorMessage>
    </FormControl>
  )
}

export default Input
