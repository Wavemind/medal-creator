/**
 * The external imports
 */
import { Controller, useFormContext } from 'react-hook-form'
import {
  Checkbox as ChakraCheckbox,
  FormControl,
  FormErrorMessage,
} from '@chakra-ui/react'

const Checkbox = ({ name, isRequired, label }) => {
  const {
    control,
    formState: { errors },
  } = useFormContext()

  return (
    <FormControl isInvalid={errors[name]} isRequired={isRequired}>
      <Controller
        control={control}
        name={name}
        render={({ field: { onChange, value } }) => (
          <ChakraCheckbox
            id={name}
            name={name}
            onChange={onChange}
            isChecked={value}
          >
            {label}
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
