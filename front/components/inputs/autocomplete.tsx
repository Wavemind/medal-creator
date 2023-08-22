/**
 * The external imports
 */
import { Controller, useFormContext } from 'react-hook-form'
import { FormLabel, FormControl, FormErrorMessage } from '@chakra-ui/react'
import { Select } from 'chakra-react-select'
import { useTranslation } from 'react-i18next'
import { ErrorMessage } from '@hookform/error-message'

/**
 * The internal imports
 */
import type { AutocompleteComponent } from '@/types'

const Autocomplete: AutocompleteComponent = ({
  name,
  isRequired = false,
  isMulti = false,
  placeholder = '',
  subLabel,
  label,
  options,
  ...restProps
}) => {
  const { t } = useTranslation()
  const {
    control,
    formState: { errors },
  } = useFormContext()

  return (
    <FormControl
      isInvalid={!!errors[name]}
      isRequired={isRequired}
      data-testid='autocomplete'
    >
      <FormLabel htmlFor={name}>{label}</FormLabel>
      {subLabel}

      <Controller
        control={control}
        name={name}
        render={({ field: { ...rest } }) => (
          <Select
            placeholder={placeholder}
            isMulti={isMulti}
            options={options}
            noOptionsMessage={() => t('noOptions', { ns: 'common' })}
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
