/**
 * The external imports
 */
import { Controller, useFormContext } from 'react-hook-form'
import { FormLabel, FormControl, FormErrorMessage } from '@chakra-ui/react'
import { Select } from 'chakra-react-select'
import { ErrorMessage } from '@hookform/error-message'

/**
 * The internal imports
 */
import type { AutocompleteComponent } from '@/types'

const Autocomplete: AutocompleteComponent = ({
  name,
  isRequired = false,
  isMulti = false,
  label,
  options,
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
          <Select
            isMulti={isMulti}
            options={options}
            {...rest}
            {...restProps}
          />
        )}
      />

      <ErrorMessage as={<FormErrorMessage />} name={name} errors={errors} />
    </FormControl>
  )
}

export default Autocomplete
