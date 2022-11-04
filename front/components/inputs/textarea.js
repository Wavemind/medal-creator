/**
 * The external imports
 */
import { Controller, useFormContext } from 'react-hook-form'
import {
  Textarea as ChakraTextarea,
  FormLabel,
  FormControl,
  FormErrorMessage,
} from '@chakra-ui/react'

const Textarea = ({ name, required, type = 'text', label }) => {
  const {
    control,
    formState: { errors },
  } = useFormContext()

  return (
    <FormControl isInvalid={errors[name]}>
      <FormLabel htmlFor={name}>
        {label}
        {required ? '*' : ''}
      </FormLabel>
      <Controller
        control={control}
        name={name}
        render={({ field: { onChange, value } }) => (
          <ChakraTextarea
            id={name}
            value={value}
            onChange={onChange}
            type={type}
          />
        )}
      />

      <FormErrorMessage>
        {errors[name] && errors[name].message}
      </FormErrorMessage>
    </FormControl>
  )
}

export default Textarea
