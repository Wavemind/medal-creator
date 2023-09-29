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
      px={3}
      fontSize='sm'
      py={1}
      bg={isFunction ? 'red.200' : 'green.200'}
      borderRadius='xl'
    >
      {children}
    </Box>
  )
}

export default Badge
