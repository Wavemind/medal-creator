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

const Select = ({
  label,
  options,
  name,
  required,
  labelOption = 'label',
  valueOption = 'value',
}) => {
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
            <option key={null} value=''></option>
            {options.map(option => (
              <option key={option[valueOption]} value={option[valueOption]}>
                {option[labelOption]}
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
