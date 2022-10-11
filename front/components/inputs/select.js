/**
 * The external imports
 */
import React from 'react'
import { FormLabel, Select as ChakraSelect } from '@chakra-ui/react'
import { useFormContext } from 'react-hook-form'

const Select = ({ label, options, name }) => {
  const { register } = useFormContext()

  return (
    <React.Fragment>
      <FormLabel>{label}</FormLabel>
      <ChakraSelect id={name} {...register(name)} placeholder='Select option'>
        {options.map(option => (
          <option value={option.value}>{option.label}</option>
        ))}
      </ChakraSelect>
    </React.Fragment>
  )
}

export default Select
