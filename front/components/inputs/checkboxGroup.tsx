/**
 * The external imports
 */
import { Controller, useFormContext } from 'react-hook-form'
import {
  Checkbox,
  CheckboxGroup as ChakraCheckboxGroup,
  FormControl,
  Stack,
  FormErrorMessage,
} from '@chakra-ui/react'
import { ErrorMessage } from '@hookform/error-message'

/**
 * The internal imports
 */
import FormLabel from '@/components/formLabel'
import type { CheckBoxGroupComponent } from '@/types'

const CheckboxGroup: CheckBoxGroupComponent = ({
  name,
  label,
  options,
  disabledOptions = [],
  labelOption = 'name',
  valueOption = 'id',
}) => {
  const {
    control,
    formState: { errors },
  } = useFormContext()

  return (
    <FormControl isInvalid={!!errors[name]}>
      <FormLabel name={name}>{label}</FormLabel>
      <Controller
        control={control}
        name={name}
        render={({ field: { onChange, value } }) => (
          <ChakraCheckboxGroup value={value} onChange={onChange}>
            <Stack spacing={[1, 5]} direction={['column', 'row']}>
              {options.map(option => (
                <Checkbox
                  data-testid='checkbox-group-option'
                  key={`checkbox_group_option_${option[valueOption]}`}
                  value={option[valueOption]}
                  isDisabled={disabledOptions.includes(option[valueOption])}
                >
                  {option[labelOption]}
                </Checkbox>
              ))}
            </Stack>
          </ChakraCheckboxGroup>
        )}
      />
      <ErrorMessage as={<FormErrorMessage />} name={name} errors={errors} />
    </FormControl>
  )
}

export default CheckboxGroup
