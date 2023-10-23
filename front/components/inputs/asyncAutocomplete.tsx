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
import type { AsyncAutocompleteComponent } from '@/types'

const AsyncAutocomplete: AsyncAutocompleteComponent = ({
  name,
  isRequired = false,
  isMulti = false,
  placeholder = '',
  subLabel,
  label,
  ...restProps
}) => {
  const { t } = useTranslation('common')
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
            defaultOptions
            noOptionsMessage={() => t('noOptions')}
            loadingMessage={() => t('searching')}
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
