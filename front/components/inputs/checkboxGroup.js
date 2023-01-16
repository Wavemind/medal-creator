/**
 * The external imports
 */
import { Controller, useFormContext } from 'react-hook-form'
import {
  Checkbox,
  CheckboxGroup as ChakraCheckboxGroup,
  FormControl,
  FormLabel,
  Stack,
  FormErrorMessage,
} from '@chakra-ui/react'

const CheckboxGroup = ({
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
    <FormControl isInvalid={errors[name]}>
      <FormLabel htmlFor={name}>{label}</FormLabel>
      <Controller
        control={control}
        name={name}
        render={({ field: { onChange, value } }) => (
          <ChakraCheckboxGroup value={value} onChange={onChange}>
            <Stack spacing={[1, 5]} direction={['column', 'row']}>
              {options.map(option => (
                <Checkbox
                  data-cy='checkbox_group_option'
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
      <FormErrorMessage>
        {errors[name] && errors[name].message}
      </FormErrorMessage>
    </FormControl>
  )
}

export default CheckboxGroup
