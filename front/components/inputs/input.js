/**
 * The external imports
 */
import React from 'react'
import { Controller, useFormContext } from 'react-hook-form'
import { useTranslation } from 'next-i18next'
import {
  Input as ChakraInput,
  FormLabel,
  FormControl,
  FormErrorMessage,
} from '@chakra-ui/react'

const Input = ({ source, name }) => {
  const { t } = useTranslation('account')
  const {
    register,
    control,
    formState: { errors },
  } = useFormContext()

  return (
    <React.Fragment>
      <FormControl isInvalid={errors[name]}>
        <FormLabel htmlFor={name}>{t(`${source}.${name}`)}*</FormLabel>
        <Controller
          control={control}
          name={name}
          render={({ field: { onChange, value } }) => (
            <ChakraInput
              id={name}
              value={value}
              onChange={onChange}
              {...register(name)}
            />
          )}
        />

        <FormErrorMessage>
          {errors[name] && errors[name].message}
        </FormErrorMessage>
      </FormControl>
    </React.Fragment>
  )
}

export default Input
