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
import type { DefaultTFuncReturn } from 'i18next'

/**
 * The internal imports
 */
import type { BaseInputProps } from '@/types'

/**
 * Type definitions
 */
type InputProps = BaseInputProps & {
  type?: string
  helperText?: DefaultTFuncReturn
}

const Input: FC<InputProps> = ({
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

      <FormHelperText>{helperText}</FormHelperText>
      <FormErrorMessage>{errors[name]?.message as string}</FormErrorMessage>
    </FormControl>
  )
}

export default Input
