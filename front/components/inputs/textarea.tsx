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
import { DefaultTFuncReturn } from 'i18next'
import { ErrorMessage } from '@hookform/error-message'

/**
 * The internal definitions
 */
import type { BaseInputProps } from '@/types'

/**
 * Type definitions
 */
type TextAreaProps = BaseInputProps & {
  helperText?: DefaultTFuncReturn
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
      <ErrorMessage as={<FormErrorMessage />} name={name} errors={errors} />
    </FormControl>
  )
}

export default Textarea
