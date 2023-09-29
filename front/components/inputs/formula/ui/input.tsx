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
    const regex = /(\[[^[\]]+\]|ToDay\([^)]+\)|ToMonth\([^)]+\))/g
    const parts = text.split(regex)
    return parts.map((part, index) => {
      if (part.match(/^\[([^\]]+)]$/)) {
        const key = `${part}-${index}`
        const badgeContent = part.replace(/[\[\]]/g, '')
        return <Badge key={key}>{badgeContent}</Badge>
      } else if (part.startsWith('ToDay(') || part.startsWith('ToMonth(')) {
        return (
          <Badge key={index} isFunction={true}>
            {part}
          </Badge>
        )
      }
      return part
    })
  }

  // return (
  //   <Box>
  //     <div
  //       contentEditable
  //       ref={inputRef}
  //       onBlur={handleInput}
  //       onInput={handleInput}
  //       style={{
  //         background: 'transparent',
  //         border: '1px solid #ccc',
  //         padding: '8px',
  //         minHeight: '40px', // Set an appropriate height
  //       }}
  //       dangerouslySetInnerHTML={{
  //         __html: parseInput(inputValue).join(''),
  //       }}
  //     />
  //   </Box>
  // )

  return (
    <>
      <Input
        ref={inputRef}
        value={inputValue}
        onChange={e => setInputValue(e.target.value)}
      />
      <Box mt={2}>
        {parseInput(inputValue).map((element, index) => (
          <React.Fragment key={index}>{element}</React.Fragment>
        ))}
      </Box>
    </>
  )
}

export default FormulaInput
