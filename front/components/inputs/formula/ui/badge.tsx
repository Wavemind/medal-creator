/**
 * The external imports
 */
import React from 'react'
import { Box } from '@chakra-ui/react'

/**
 * The internal imports
 */
import { useFormula } from '@/lib/hooks/useFormula'

function Badge({ children, isFunction = false }) {
  const { inputValue, setInputValue, inputRef } = useFormula()

  return (
    <Box
      as='span'
      px={1}
      fontSize='sm'
      py={2}
      bg={isFunction ? 'red' : 'green.200'}
      borderRadius='2xl'
    >
      {children}
    </Box>
  )
}

export default Badge
