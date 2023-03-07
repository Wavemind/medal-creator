/**
 * The external imports
 */
import { FC } from 'react'
import { Controller, useFormContext } from 'react-hook-form'
import {
  Checkbox,
  CheckboxGroup as ChakraCheckboxGroup,
  FormControl,
  FormLabel,
  Stack,
  FormErrorMessage,
} from '@chakra-ui/react'

/**
 * The internal imports
 */
import type { BaseInputProps } from '@/types'

/**
 * Type definitions
 */
type Option = {
  [key: string]: string | number
}

type CheckBoxGroupProps = BaseInputProps & {
  options: Option[]
  disabledOptions?: (string | number)[]
  labelOption?: string
  valueOption?: string
}

const CheckboxGroup: FC<CheckBoxGroupProps> = ({
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
                  key={`checkbox_group_option_${
                    option[valueOption as keyof Option]
                  }`}
                  value={option[valueOption as keyof Option]}
                  isDisabled={disabledOptions.includes(
                    option[valueOption as keyof Option]
                  )}
                >
                  {option[labelOption as keyof Option]}
                </Checkbox>
              ))}
            </Stack>
          </ChakraCheckboxGroup>
        )}
      />
      <FormErrorMessage>{errors[name]?.message as string}</FormErrorMessage>
    </FormControl>
  )
}

export default CheckboxGroup
