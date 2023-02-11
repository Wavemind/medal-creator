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
interface Props extends BaseInputProps {
  helperText: string
}

const Textarea: FC<Props> = ({
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
        render={({ field: { onChange, value } }) => (
          <ChakraTextarea
            id={name}
            name={name}
            value={value}
            onChange={onChange}
            {...restProps}
          />
        )}
      />

      {helperText && <FormHelperText>{helperText}</FormHelperText>}
      <FormErrorMessage>
        {errors[name]?.message as string}
      </FormErrorMessage>
    </FormControl>
  )
}

export default Textarea
