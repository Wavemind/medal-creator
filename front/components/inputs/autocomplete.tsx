/**
 * The external imports
 */
import { Controller, useFormContext } from 'react-hook-form'
import { FormControl, FormErrorMessage } from '@chakra-ui/react'
import { Select } from 'chakra-react-select'
import { useTranslation } from 'react-i18next'
import { ErrorMessage } from '@hookform/error-message'
import get from 'lodash/get'

/**
 * The internal imports
 */
import FormLabel from '@/components/formLabel'
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
  const { t } = useTranslation('common')
  const {
    control,
    formState: { errors },
  } = useFormContext()

  const error = get(errors, name)

  return (
    <FormControl isInvalid={!!error} data-testid='autocomplete'>
      {label && (
        <FormLabel name={name} isRequired={isRequired}>
          {label}
        </FormLabel>
      )}
      {subLabel}

      <Controller
        control={control}
        name={name}
        render={({ field: { ...rest } }) => (
          <Select
            placeholder={placeholder}
            isMulti={isMulti}
            options={options}
            noOptionsMessage={() => t('noOptions')}
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
