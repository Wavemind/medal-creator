/**
 * The external imports
 */
import {
  Select as ChakraSelect,
  FormControl,
  FormErrorMessage,
} from '@chakra-ui/react'
import { useFormContext, Controller, FieldValues } from 'react-hook-form'
import { ErrorMessage } from '@hookform/error-message'
import get from 'lodash/get'

/**
 * The internal imports
 */
import FormLabel from '@/components/formLabel'
import type { SelectComponent } from '@/types'

const Select: SelectComponent = ({
  label = null,
  options,
  name,
  isRequired,
  labelOption = 'label',
  valueOption = 'value',
  isDisabled = false,
}) => {
  const {
    control,
    formState: { errors },
  } = useFormContext<FieldValues>()

  const error = get(errors, name)

  return (
    <FormControl isInvalid={!!error}>
      {label && (
        <FormLabel name={name} isRequired={isRequired}>
          {label}
        </FormLabel>
      )}
      <Controller
        control={control}
        name={name}
        render={({ field: { ...rest } }) => (
          <ChakraSelect id={name} {...rest} isDisabled={isDisabled}>
            <option key={null} value={undefined}></option>
            {options.map(option => (
              <option key={option[valueOption]} value={option[valueOption]}>
                {option[labelOption]}
              </option>
            ))}
          </ChakraSelect>
        )}
      />
      <ErrorMessage as={<FormErrorMessage />} name={name} errors={errors} />
    </FormControl>
  )
}

export default Select
