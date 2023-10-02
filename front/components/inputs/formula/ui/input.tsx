/**
 * The external imports
 */
import React from 'react'
import { Box, Input } from '@chakra-ui/react'

/**
 * The internal imports
 */
import { useFormula } from '@/lib/hooks/useFormula'
import Badge from './badge'

function FormulaInput() {
  const { inputValue, setInputValue, inputRef } = useFormula()

  const parseInput = (text: string) => {
    // Track [] or ToDay([]) or ToMonth([])
    const regex = /(\[[^[\]]+\]|ToDay\([^)]+\)|ToMonth\([^)]+\))/g
    const parts = text.split(regex)
    return parts.map((part, index) => {
      if (part.match(/^\[([^\]]+)]$/)) {
        const key = `${part}-${index}`
        // Get element inside []
        const badgeContent = part.replace(/[\[\]]/g, '')
        return <Badge key={key}>{badgeContent}</Badge>
      } else if (part.startsWith('ToDay(') || part.startsWith('ToMonth(')) {
        const cleanedString = part.replace(/[\[\]]/g, '') // Remove [] inside ()
        return (
          <Badge key={index} isFunction={true}>
            {cleanedString}
          </Badge>
        )
      }
      return part
    })
  }

  return (
    <>
      <Input
        ref={inputRef}
        value={inputValue}
        onChange={e => setInputValue(e.target.value)}
      />
      <Box my={2} p={3} bg='blackAlpha.50' borderRadius='xl'>
        {parseInput(inputValue).map((element, index) => (
          <React.Fragment key={index}>{element}</React.Fragment>
        ))}
      </Box>
    </>
  )
}

export default FormulaInput
