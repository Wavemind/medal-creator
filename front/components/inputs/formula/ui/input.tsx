/**
 * The external imports
 */
import React, { useEffect, useState } from 'react'
import { Box, Input, Badge, Textarea } from '@chakra-ui/react'

/**
 * The internal imports
 */
import { useFormula } from '@/lib/hooks/useFormula'

function FormulaInput() {
  const { inputValue, setInputValue, inputRef } = useFormula()

  console.log(inputRef.current?.selectionStart)

  const parseInput = (text: string) => {
    const regex = /(\[[^[\]]+\]|ToDay\([^)]+\)|ToMonth\([^)]+\))/g
    const parts = text.split(regex)
    return parts.map((part, index) => {
      if (part.match(/^\[([^\]]+)]$/)) {
        const key = `${part}-${index}`
        const badgeContent = part.replace(/[\[\]]/g, '')
        return (
          <Badge key={key} colorScheme='teal'>
            {badgeContent}
          </Badge>
        )
      } else if (part.startsWith('ToDay(') || part.startsWith('ToMonth(')) {
        return (
          <Badge key={index} colorScheme='red'>
            {part}
          </Badge>
        )
      }
      return part
    })
  }

  const handleInput = (e: React.ChangeEvent<HTMLDivElement>) => {
    setInputValue(e.target.innerText)
  }

  return (
    <Box>
      <div
        contentEditable
        ref={inputRef}
        onBlur={handleInput}
        onInput={handleInput}
        style={{
          background: 'transparent',
          border: '1px solid #ccc',
          padding: '8px',
          minHeight: '40px', // Set an appropriate height
        }}
        dangerouslySetInnerHTML={{
          __html: parseInput(inputValue).join(''),
        }}
      />
    </Box>
  )

  // return (
  //   <>
  //     <Input
  //       ref={inputRef}
  //       value={inputValue}
  //       onChange={e => setInputValue(e.target.value)}
  //     />
  //     <Box mt={2}>
  //       {parseInput(inputValue).map((element, index) => (
  //         <React.Fragment key={index}>{element}</React.Fragment>
  //       ))}
  //     </Box>
  //   </>
  // )
}

export default FormulaInput
