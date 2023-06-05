/**
 * The external imports
 */
import React, { useContext } from 'react'
import { ErrorMessage } from '@hookform/error-message'
import { Controller, useFormContext } from 'react-hook-form'
import {
  Input as ChakraInput,
  FormLabel,
  FormControl,
  FormErrorMessage,
  FormHelperText,
  HStack,
} from '@chakra-ui/react'
import get from 'lodash/get'

/**
 * The internal imports
 */
import { InformationIcon } from '@/assets/icons'
import { DrawerContext } from '@/lib/contexts'
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

  const { openDrawer, isDrawerOpen, closeDrawer } = useContext(DrawerContext)

  const error = get(errors, name)

  /**
   * Toggles the drawer
   */
  const handleToggle = () => {
    if (isDrawerOpen) {
      closeDrawer()
    } else {
      openDrawer({ title: drawerTitle, content: drawerContent })
    }
  }

  return (
    <FormControl isInvalid={!!error} isRequired={isRequired}>
      <HStack alignItems='right'>
        <FormLabel htmlFor={name}>{label}</FormLabel>
        {hasDrawer && (
          <InformationIcon onClick={handleToggle} cursor='pointer' />
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
