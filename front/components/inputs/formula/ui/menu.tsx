/**
 * The external imports
 */
import { Box, Menu, MenuItem } from '@chakra-ui/react'

/**
 * The internal imports
 */
import { useFormula } from '@/lib/hooks/useFormula'

function FormulaMenu() {
  const { autocompleteOptions, handleMenuItemClick } = useFormula()

  // TODO: Check if we can move in menuItem with keyboard arrow
  return (
    autocompleteOptions.length > 0 && (
      <Box
        position='absolute'
        w='full'
        bg='white'
        borderRadius='md'
        zIndex={99}
        boxShadow='sm'
        outline='2px solid transparent'
        outlineOffset='2px'
        borderWidth='1px'
        transform='translate(0, 5px)'
      >
        <Menu>
          {autocompleteOptions.map(option => (
            <MenuItem
              _hover={{ bg: 'grey.100' }}
              onClick={() => handleMenuItemClick(option.value)}
              key={option.label}
            >
              {option.label}
            </MenuItem>
          ))}
        </Menu>
      </Box>
    )
  )
}

export default FormulaMenu
