/**
 * The external imports
 */
import { Controller, useFormContext } from 'react-hook-form'
import {
  Input as ChakraInput,
  FormLabel,
  FormControl,
  FormErrorMessage,
} from '@chakra-ui/react'

const Input = ({ name, isRequired, type = 'text', label, ...restProps }) => {
  const {
    control,
    formState: { errors },
  } = useFormContext()

  return (
    <FormControl
      data-cy={`form_control_${name}`}
      isInvalid={errors[name]}
      isRequired={isRequired}
    >
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

      <FormErrorMessage>
        {errors[name] && errors[name].message}
      </FormErrorMessage>
    </FormControl>
  )
}

export default Input
