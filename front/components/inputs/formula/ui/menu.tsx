/**
 * The external imports
 */
import {
  Box,
  Menu,
  MenuButton,
  MenuItem,
  MenuList,
  useDisclosure,
} from '@chakra-ui/react'

/**
 * The internal imports
 */
import { useFormula } from '@/lib/hooks/useFormula'
import { useRef } from 'react'

function FormulaMenu() {
  const { autocompleteOptions, handleMenuItemClick, inputRef } = useFormula()
  const itemRef = useRef()

  // TODO: Check if we can move in menuItem with keyboard arrow
  return (
    <Menu
      isOpen={autocompleteOptions.length > 0}
      isLazy
      onClose={() => inputRef.current?.focus()}
      gutter={24}
    >
      <MenuList>
        {autocompleteOptions.map(option => (
          <MenuItem
            _hover={{ bg: 'grey.100' }}
            onClick={() => handleMenuItemClick(option.value)}
            key={option.label}
          >
            {option.label}
          </MenuItem>
        ))}
      </MenuList>
    </Menu>
  )
}

export default FormulaMenu
