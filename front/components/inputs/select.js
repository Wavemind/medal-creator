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
  isRequired,
  labelOption = 'label',
  valueOption = 'value',
}) => {
  const {
    control,
    formState: { errors },
  } = useFormContext()

  return (
    <FormControl isInvalid={errors[name]} isRequired={isRequired}>
      <FormLabel htmlFor={name}>{label}</FormLabel>
      <Controller
        control={control}
        name={name}
        render={({ field: { onChange, value } }) => (
          <ChakraSelect id={name} name={name} value={value} onChange={onChange}>
            <option key={null} value=''></option>
            {options?.map(option => (
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
