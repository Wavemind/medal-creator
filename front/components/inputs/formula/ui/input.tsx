/**
 * The external imports
 */
import { Input } from '@chakra-ui/react'

/**
 * The internal imports
 */
import { useFormula } from '@/lib/hooks/useFormula'

function FormulaInput() {
  const { inputValue, setInputValue, inputRef } = useFormula()

  return (
    <Input
      ref={inputRef}
      value={inputValue}
      onChange={e => setInputValue(e.target.value)}
    />
  )
}

export default FormulaInput
