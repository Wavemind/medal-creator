/**
 * The external imports
 */
import { Controller, useFormContext } from 'react-hook-form'
import { FormControl, FormErrorMessage } from '@chakra-ui/react'
import { AsyncSelect } from 'chakra-react-select'
import { useTranslation } from 'react-i18next'
import { ErrorMessage } from '@hookform/error-message'

/**
 * The internal imports
 */
import FormLabel from '@/components/formLabel'
import type { AutocompleteComponent } from '@/types'

const AsyncAutocomplete: AutocompleteComponent = ({
  name,
  isRequired = false,
  isMulti = false,
  placeholder = '',
  subLabel,
  label,
  ...restProps
}) => {
  const { t } = useTranslation()
  const {
    control,
    formState: { errors },
  } = useFormContext()

  return (
    <FormControl isInvalid={!!errors[name]} data-testid='autocomplete'>
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
          <AsyncSelect
            placeholder={placeholder}
            isMulti={isMulti}
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

export default AsyncAutocomplete
