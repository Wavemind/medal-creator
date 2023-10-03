/**
 * The external imports
 */
import { Menu, MenuItem, MenuList } from '@chakra-ui/react'
import type { FC } from 'react'

/**
 * The internal imports
 */
import { useFormula } from '@/lib/hooks/useFormula'

const FormulaMenu: FC = () => {
  const { autocompleteOptions, handleMenuItemClick, inputRef } = useFormula()

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
            key={option.label}
            onClick={() => handleMenuItemClick(option.value)}
          >
            {option.label}
          </MenuItem>
        ))}
      </MenuList>
    </Menu>
  )
}

export default FormulaMenu
