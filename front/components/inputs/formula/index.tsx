/**
 * The external imports
 */
import { Box } from '@chakra-ui/react'

/**
 * The internal imports
 */
import FormulaInput from './ui/input'
import FormulaMenu from './ui/menu'
import FormulaProvider from '@/lib/providers/formula'

function Formula() {
  return (
    <FormulaProvider>
      <Box position='relative'>
        <FormulaInput />
        <FormulaMenu />
      </Box>
    </FormulaProvider>
  )
}

export default Formula
