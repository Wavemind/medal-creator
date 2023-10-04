/**
 * The external imports
 */
import React from 'react'
import { ErrorMessage } from '@hookform/error-message'
import { Controller, useFormContext } from 'react-hook-form'
import {
  Input as ChakraInput,
  FormLabel,
  FormControl,
  FormErrorMessage,
  FormHelperText,
  HStack,
  Text,
} from '@chakra-ui/react'
import get from 'lodash/get'

/**
 * The internal imports
 */
import InformationIcon from '@/assets/icons/Information'
import { useDrawer } from '@/lib/hooks'
import type { InputComponent } from '@/types'

const Input: InputComponent = ({
  name,
  isRequired = false,
  label,
  type = 'text',
  helperText,
  hasDrawer = false,
  drawerContent = null,
  drawerTitle = '',
  ...restProps
}) => {
  const {
    control,
    formState: { errors },
  } = useFormContext()

  const { open, isOpen, close } = useDrawer()

  const error = get(errors, name)

  /**
   * Toggles the drawer
   */
  const handleToggle = () => {
    if (isOpen) {
      close()
    } else {
      open({ title: drawerTitle, content: drawerContent })
    }
  }

  return (
    <FormControl isInvalid={!!error}>
      <HStack alignItems='right'>
        <FormLabel htmlFor={name}>
          {label}{' '}
          {isRequired && (
            <Text as='span' color='secondary'>
              *
            </Text>
          )}
        </FormLabel>
        {hasDrawer && (
          <InformationIcon
            onClick={handleToggle}
            cursor='pointer'
            data-testid={`info-${name}`}
          />
        )}
      </HStack>
      <Controller
        control={control}
        name={name}
        render={({ field: { ...rest } }) => (
          <ChakraInput
            id={name}
            type={type}
            autoComplete='off'
            {...rest}
            {...restProps}
          />
        )}
      />

      {helperText && <FormHelperText>{helperText}</FormHelperText>}
      <ErrorMessage as={<FormErrorMessage />} name={name} errors={errors} />
    </FormControl>
  )
}

export default Input
