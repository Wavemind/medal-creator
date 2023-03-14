/**
 * The external imports
 */
import { FC } from 'react'
import { Controller, useFormContext } from 'react-hook-form'
import {
  Checkbox as ChakraCheckbox,
  FormControl,
  FormErrorMessage,
} from '@chakra-ui/react'
import { ErrorMessage } from '@hookform/error-message'

/**
 * The internal imports
 */
import type { BaseInputProps } from '@/types'

const Checkbox: FC<BaseInputProps> = ({ name, isRequired, label }) => {
  const {
    control,
    formState: { errors },
  } = useFormContext()

  return (
    <FormControl isInvalid={!!errors[name]} isRequired={isRequired}>
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
      <ErrorMessage as={<FormErrorMessage />} name={name} errors={errors} />
    </FormControl>
  )
}

export default Checkbox
