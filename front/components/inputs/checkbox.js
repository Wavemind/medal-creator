/**
 * The external imports
 */
import { Controller, useFormContext } from 'react-hook-form'
import {
  Checkbox as ChakraCheckbox,
  FormControl,
  FormErrorMessage,
} from '@chakra-ui/react'

const Checkbox = ({ name, required, label }) => {
  const {
    control,
    formState: { errors },
  } = useFormContext()

  return (
    <FormControl isInvalid={errors[name]}>
      <Controller
        control={control}
        name={name}
        render={({ field: { value } }) => (
          <ChakraCheckbox id={name} value={value}>
            {label}
            {required ? '*' : ''}
          </ChakraCheckbox>
        )}
      />
      <FormErrorMessage>
        {errors[name] && errors[name].message}
      </FormErrorMessage>
    </FormControl>
  )
}

export default Checkbox
