/**
 * The external imports
 */
import {
  FormLabel,
  Select as ChakraSelect,
  FormControl,
  FormErrorMessage,
} from '@chakra-ui/react'
import { useFormContext, Controller } from 'react-hook-form'

const Select = ({ label, options, name, required }) => {
  const {
    register,
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
          <ChakraSelect
            id={name}
            value={value}
            onChange={onChange}
            {...register(name)}
          >
            {options.map(option => (
              <option key={option.value} value={option.value}>
                {option.label}
              </option>
            ))}
          </ChakraSelect>
        )}
      />

      <FormErrorMessage>
        {errors[name] && errors[name].message}
      </FormErrorMessage>
    </FormControl>
  )
}

export default Select
